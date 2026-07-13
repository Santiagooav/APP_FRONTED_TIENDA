import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../servicios/cliente';
import { Cliente } from '../../interfaces/cliente';
import { ModalController, ToastController, AlertController } from '@ionic/angular/standalone';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonContent, IonItem, IonLabel, IonInput, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, trashOutline, saveOutline } from 'ionicons/icons';

@Component({
  selector: 'app-detalle-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle,
    IonButtons, IonButton, IonContent, IonItem, IonLabel, IonInput, IonIcon],
  templateUrl: './detalle-cliente.page.html'
})
export class DetalleClientePage implements OnInit {
  @Input() cliente: Cliente | null = null;

  form: any = {
    identificacion: '',
    nombre: '',
    telefono: '',
    correo: '',
    direccion: '',
    pais: '',
    ciudad: ''
  };

  esEdicion = false;

  constructor(
    private modalCtrl: ModalController,
    private clienteService: ClienteService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) { addIcons({ closeOutline, trashOutline, saveOutline }); }

  ngOnInit() {
    if (this.cliente) {
      this.esEdicion = true;
      this.form = {
        identificacion: this.cliente.identificacion,
        nombre: this.cliente.nombre,
        telefono: this.cliente.telefono,
        correo: this.cliente.correo,
        direccion: this.cliente.direccion,
        pais: this.cliente.pais,
        ciudad: this.cliente.ciudad
      };
    }
  }

  cerrar() { this.modalCtrl.dismiss(); }

  guardar() {
    console.log('Enviando form:', this.form);
    if (this.esEdicion) {
      this.clienteService.putCliente(this.cliente!.id, this.form).subscribe({
        next: () => { this.showToast('Cliente actualizado', 'success'); this.modalCtrl.dismiss({ actualizar: true }); },
        error: (err) => { console.error(err); this.showToast('Error al actualizar', 'danger'); }
      });
    } else {
      this.clienteService.postCliente(this.form).subscribe({
        next: () => { this.showToast('Cliente creado', 'success'); this.modalCtrl.dismiss({ actualizar: true }); },
        error: (err) => { console.error(err); this.showToast('Error al crear', 'danger'); }
      });
    }
  }

  async eliminar() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: '¿Eliminar este cliente?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', role: 'destructive', handler: () => {
          this.clienteService.deleteCliente(this.cliente!.id).subscribe({
            next: () => { this.showToast('Cliente eliminado', 'success'); this.modalCtrl.dismiss({ actualizar: true }); },
            error: (err) => { console.error(err); this.showToast('Error al eliminar', 'danger'); }
          });
        }}
      ]
    });
    await alert.present();
  }

  async showToast(msg: string, color: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 2000, color });
    t.present();
  }
}