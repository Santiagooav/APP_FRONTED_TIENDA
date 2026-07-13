import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../servicios/producto';
import { ModalController, ToastController, AlertController, IonBackButton } from '@ionic/angular/standalone';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonContent, IonItem, IonLabel, IonInput, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, trashOutline, saveOutline } from 'ionicons/icons';

@Component({
  selector: 'app-detalle-producto',
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle,
    IonButtons, IonButton, IonContent, IonItem, IonLabel, IonInput, IonIcon],
  templateUrl: './detalle-producto.page.html'
})
export class DetalleProductoPage implements OnInit {
  @Input() producto: any | null = null; 

  // Campos limpios extraídos directamente de tu consulta SQL real
  form: any = { 
    nombre: '', 
    descripcion: '', 
    precio: 0, 
    stock: 0
  };
  
  esEdicion = false;
  imagenSeleccionada: File | null = null;
  imagenPreview: string | null = null;

  constructor(
    private productoService: ProductoService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {
    addIcons({ closeOutline, trashOutline, saveOutline });
  }

  ngOnInit() {
    if (this.producto) {
      this.esEdicion = true;
      
      // Mapeo 1:1 con las columnas exactas de la consulta: id, nombre, descripcion, precio, stock
      this.form.nombre = this.producto.nombre || '';
      this.form.descripcion = this.producto.descripcion || '';
      this.form.precio = this.producto.precio || 0;
      this.form.stock = this.producto.stock || 0;
      
      if (this.producto.prod_imagen) {
        this.imagenPreview = 'http://localhost:3000' + this.producto.prod_imagen;
      }
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagenSeleccionada = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color
    });
    await toast.present();
  }

  guardar() {
    if (!this.form.nombre || this.form.precio <= 0 || this.form.stock < 0) {
      this.showToast('Por favor llene todos los campos con valores válidos', 'warning');
      return;
    }

    // El FormData debe emparejarse con lo que el backend desestructura
    const formData = new FormData();
    formData.append('nombre', this.form.nombre);
    formData.append('descripcion', this.form.descripcion);
    formData.append('precio', this.form.precio.toString());
    formData.append('stock', this.form.stock.toString());

    if (this.imagenSeleccionada) {
      formData.append('prod_imagen', this.imagenSeleccionada, this.imagenSeleccionada.name);
    }

    // Usamos la columna id pura de la tabla
    const idProducto = this.producto?.id;

    if (this.esEdicion && idProducto) {
      this.productoService.putProducto(idProducto, formData).subscribe({
        next: () => {
          this.showToast('Producto actualizado con éxito', 'success');
          this.modalCtrl.dismiss({ actualizar: true });
        },
        error: (err) => {
          console.error(err);
          this.showToast('Error al actualizar el producto', 'danger');
        }
      });
    } else {
      this.productoService.postProducto(formData).subscribe({
        next: () => {
          this.showToast('Producto creado con éxito', 'success');
          this.modalCtrl.dismiss({ actualizar: true });
        },
        error: (err) => {
          console.error(err);
          this.showToast('Error al crear el producto', 'danger');
        }
      });
    }
  }

  async eliminar() {
    const idProducto = this.producto?.id;
    if (!idProducto) {
      this.showToast('No se puede eliminar: ID no encontrado', 'danger');
      return;
    }

    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: '¿Está seguro de eliminar este producto?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { 
          text: 'Eliminar', 
          role: 'destructive', 
          handler: () => {
            this.productoService.deleteProducto(idProducto).subscribe({
              next: () => { 
                this.showToast('Producto eliminado', 'success'); 
                this.modalCtrl.dismiss({ actualizar: true }); 
              },
              error: () => this.showToast('Error al eliminar el producto', 'danger')
            });
          }
        }
      ]
    });
    await alert.present();
  }
}