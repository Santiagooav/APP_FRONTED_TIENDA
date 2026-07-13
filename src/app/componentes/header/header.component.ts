import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  @Input() titulo: string = '';
  @Input() mostrarBack: boolean = false;
}