import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../servicios/auth';
import { ToastController, IonHeader, IonToolbar, IonTitle } from '@ionic/angular/standalone';
import {
  IonContent, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonItem, IonLabel, IonInput, IonButton, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logInOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, IonContent, IonCard, IonCardContent, IonCardHeader,
    IonCardTitle, IonItem, IonLabel, IonInput, IonButton, IonIcon],
  templateUrl: './login.page.html'
})
export class LoginPage {
  email = '';
  password = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private toastCtrl: ToastController
  ) { addIcons({ logInOutline }); }

  async login() {
    if (!this.email || !this.password) {
      return this.showToast('Completa todos los campos', 'warning');
    }
    this.auth.login(this.email, this.password).subscribe({
    next: (res: any) => {
      console.log('Login exitoso:', res);
      this.router.navigateByUrl('/principal');
    },
    error: (err: any) => {
      console.error('Error login:', err);
      this.showToast('Credenciales incorrectas', 'danger');
    }
    });
  }

  async showToast(msg: string, color: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 2000, color });
    t.present();
  }
}