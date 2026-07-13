import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonContent, IonCol, IonRow, IonCard, IonGrid, IonCardHeader, 
  IonCardTitle, IonCardContent, IonButtons, IonButton, IonIcon, 
  IonBadge, IonModal, IonList, IonItem, IonFab, IonFabButton, IonToolbar, IonHeader, IonTitle, ToastController, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cartOutline, addCircleOutline, closeOutline, trashOutline, documentTextOutline } from 'ionicons/icons';
import { ProductoService } from '../../servicios/producto';
import { Ipedido } from '../../interfaces/pedidos';
import { HeaderComponent } from "src/app/componentes/header/header.component";

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.page.html',
  styleUrls: ['./catalogo.page.scss'],
  standalone: true,
  imports: [IonLabel, 
    IonIcon, IonButton, IonButtons, IonCardContent, IonCardTitle,
    IonCardHeader, IonGrid, IonCard, IonRow, IonCol, IonContent,
    IonBadge, IonModal, IonList, IonItem, IonFab, IonFabButton,
    IonToolbar, IonHeader, IonTitle, CommonModule, FormsModule,
    HeaderComponent
]
})
export class CatalogoPage implements OnInit {
  productos: any[] = [];
  carrito: any[] = []; 
  isModalOpen = false;
  baseUrl: string = 'http://localhost:3000'; 

  constructor(
    private productoService: ProductoService,
    private router: Router,
    private toastCtrl: ToastController
  ) { 
    addIcons({ cartOutline, addCircleOutline, closeOutline, trashOutline, documentTextOutline });
  }

  ngOnInit() {
    this.obtenerCatalogo();
  }

  obtenerCatalogo() {
    this.productoService.getProductos().subscribe({
      next: (data: any) => {
        if (Array.isArray(data)) {
          this.productos = data;
        } else if (data && Array.isArray(data.data)) {
          this.productos = data.data;
        }
      },
      error: (err) => console.error('Error al cargar catálogo:', err)
    });
  }

  async showToast(msg: string, color: string) {
    const toast = await this.toastCtrl.create({ message: msg, duration: 1500, color: color });
    await toast.present();
  }

  agregarAlCarrito(producto: any) {
    const itemExistente = this.carrito.find(item => item.producto.id === producto.id);
    
    if (itemExistente) {
      if (itemExistente.cantidad >= producto.stock) {
        this.showToast('No hay más stock disponible en inventario', 'warning');
        return;
      }
      itemExistente.cantidad++;
    } else {
      this.carrito.push({ producto, cantidad: 1 });
    }
    this.showToast(`${producto.nombre} añadido al carrito`, 'success');
  }

  eliminarDelCarrito(idProducto: number) {
    this.carrito = this.carrito.filter(item => item.producto.id !== idProducto);
  }

  obtenerTotalCantidades(): number {
    return this.carrito.reduce((acc, item) => acc + item.cantidad, 0);
  }

  setOpenModal(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  irADetallePedido() {
    this.setOpenModal(false);
    const pedidoEstructurado: Ipedido = {
      id_cliente: 1, 
      id_usuario: 1, 
      ped_estado: 'Pendiente',
      detalles: this.carrito.map(item => ({
        id_producto: item.producto.id,
        det_cantidad: item.cantidad,
        det_precio: item.producto.precio
      }))
    };
    this.router.navigate(['/detalle-pedido'], { state: { pedido: pedidoEstructurado } });
  }
}