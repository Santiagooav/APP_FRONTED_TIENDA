import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth';
import { HeaderComponent } from '../../componentes/header/header.component';
import {
  IonContent, IonCard, IonCardContent, IonButton, IonIcon, IonText, IonHeader, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { peopleOutline, cartOutline, logOutOutline, gridOutline } from 'ionicons/icons';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [HeaderComponent, IonContent, IonCard, IonCardContent, IonButton, IonIcon, IonText],
  templateUrl: './principal.page.html'
})
export class PrincipalPage implements OnInit {
  nombreUsuario = '';

  constructor(private auth: AuthService, private router: Router) {
    addIcons({ peopleOutline, cartOutline, logOutOutline, gridOutline });
  }

  ngOnInit() {
    const u = this.auth.getUsuario();
    this.nombreUsuario = u?.nombre || 'Usuario';
  }

  irA(ruta: string) {
    this.router.navigateByUrl(ruta);
  }

  logout() {
    this.auth.logout();
  }
}