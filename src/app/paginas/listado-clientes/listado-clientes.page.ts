import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../servicios/cliente';
import { Cliente } from '../../interfaces/cliente';
import { HeaderComponent } from '../../componentes/header/header.component';
import { ModalController, ToastController, IonHeader, IonToolbar } from '@ionic/angular/standalone';
import { DetalleClientePage } from '../detalle-cliente/detalle-cliente.page';
import {
  IonContent, IonList, IonItem, IonLabel, IonFab, IonFabButton,
  IonIcon, IonText, IonNote
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';

@Component({
  selector: 'app-listado-clientes',
  standalone: true,
  imports: [CommonModule, HeaderComponent, IonContent, IonList, IonItem,
    IonLabel, IonFab, IonFabButton, IonIcon, IonText],
  templateUrl: './listado-clientes.page.html'
})
export class ListadoClientesPage implements OnInit {
  clientes: Cliente[] = [];

  constructor(
    private clienteService: ClienteService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) { addIcons({ addOutline }); }

  ngOnInit() { this.cargar(); }

  cargar() {
    this.clienteService.getClientes().subscribe({
      next: (data) => this.clientes = data,
      error: () => this.showToast('Error al cargar clientes', 'danger')
    });
  }

  async abrirModal(cliente?: Cliente) {
    const modal = await this.modalCtrl.create({
      component: DetalleClientePage,
      componentProps: { cliente: cliente || null }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data?.actualizar) this.cargar();
  }

  async showToast(msg: string, color: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 2000, color });
    t.present();
  }
}