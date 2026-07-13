import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../servicios/producto';
import { Producto } from '../../interfaces/producto';
import { HeaderComponent } from '../../componentes/header/header.component';
import { ModalController, ToastController, IonHeader } from '@ionic/angular/standalone';
import { DetalleProductoPage } from '../detalle-producto/detalle-producto.page';
import {
  IonContent, IonList, IonItem, IonLabel, IonFab, IonFabButton,
  IonIcon, IonText, IonThumbnail
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';

@Component({
  selector: 'app-listado-productos',
  standalone: true,
  imports: [CommonModule, HeaderComponent, IonContent, IonList, IonItem,
    IonLabel, IonFab, IonFabButton, IonIcon, IonText, IonThumbnail], // IonThumbnail añadido aquí
  templateUrl: './listado-productos.page.html'
})
export class ListadoProductosPage implements OnInit {
  productos: Producto[] = [];

  constructor(
    private productoService: ProductoService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) { addIcons({ addOutline }); }

  ngOnInit() { this.cargar(); }

  cargar() {
    this.productoService.getProductos().subscribe({
      next: (data) => this.productos = data,
      error: () => this.showToast('Error al cargar productos', 'danger')
    });
  }

  async abrirModal(producto?: Producto) {
    const modal = await this.modalCtrl.create({
      component: DetalleProductoPage,
      componentProps: { producto: producto || null }
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