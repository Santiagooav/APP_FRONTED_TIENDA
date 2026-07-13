import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton,
  IonButtons, IonItem, IonLabel, IonInput, IonButton, IonIcon,
  IonList, IonNote, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { searchOutline, checkmarkDoneOutline, personAddOutline } from 'ionicons/icons';
import { Ipedido } from '../../interfaces/pedidos';
import { ClienteService } from '../../servicios/cliente';
import { PedidoService } from '../../servicios/pedidos';

@Component({
  selector: 'app-pasarela-pago',
  templateUrl: './pasarela-pago.page.html',
  styleUrls: ['./pasarela-pago.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton,
    IonButtons, IonItem, IonLabel, IonInput, IonButton,
    CommonModule, FormsModule,
    IonIcon,
    IonNote
]
})
export class PasarelaPagoPage implements OnInit {
  pedido: Ipedido | null = null;
  total = 0;

  identificacion = '';
  clienteEncontrado = false;
  clienteExistente = false;
  idClienteEncontrado = 0;
  buscando = false;

  cliente = {
    nombre: '', telefono: '', correo: '',
    direccion: '', pais: '', ciudad: ''
  };

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private clienteService: ClienteService,
    private pedidoService: PedidoService
  ) {
    addIcons({ searchOutline, checkmarkDoneOutline, personAddOutline });
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['pedido']) {
      this.pedido = navigation.extras.state['pedido'];
      if (this.pedido) {
        this.total = this.pedido.detalles.reduce(
          (acc, item) => acc + (item.det_precio * item.det_cantidad), 0
        );
      }
    }
  }

  ngOnInit() {
    this.buscarCliente();
    this.confirmarTransaccion();
  }

  async buscarCliente() {
    if (!this.identificacion) {
      return this.showToast('Ingrese una identificación', 'warning');
    }
    this.buscando = true;
    this.clienteService.getClientes().subscribe({
      next: (lista: any) => {
        const encontrado = lista.find((c: any) => c.identificacion === this.identificacion);
        this.buscando = false;
        if (encontrado) {
          this.clienteExistente = true;
          this.idClienteEncontrado = encontrado.id;
          this.cliente = {
            nombre: encontrado.nombre,
            telefono: encontrado.telefono,
            correo: encontrado.correo,
            direccion: encontrado.direccion,
            pais: encontrado.pais,
            ciudad: encontrado.ciudad
          };
          this.showToast('Cliente encontrado', 'success');
        } else {
          this.clienteExistente = false;
          this.idClienteEncontrado = 0;
          this.cliente = { nombre: '', telefono: '', correo: '', direccion: '', pais: '', ciudad: '' };
          this.showToast('Cliente nuevo, complete sus datos', 'warning');
        }
        this.clienteEncontrado = true;
      },
      error: () => {
        this.buscando = false;
        this.showToast('Error al buscar cliente', 'danger');
      }
    });
  }

  async confirmarTransaccion(){
    if (!this.identificacion || !this.cliente.nombre || !this.cliente.telefono || !this.cliente.correo) {
      return this.showToast('Complete los datos del cliente', 'warning');
    }
    if (!this.pedido) {
      return this.showToast('No hay productos en el pedido', 'danger');
    }

    const fecha = new Date().toLocaleDateString('es-EC');

    const data = {
      id_cliente: this.clienteExistente ? this.idClienteEncontrado : 0,
      identificacion: this.identificacion,
      nombre: this.cliente.nombre,
      telefono: this.cliente.telefono,
      correo: this.cliente.correo,
      direccion: this.cliente.direccion,
      pais: this.cliente.pais,
      ciudad: this.cliente.ciudad,
      ped_fecha: fecha,
      id_usuario: this.pedido.id_usuario,
      ped_estado: 1,
      detalle: this.pedido.detalles.map(d => ({
        id_producto: d.id_producto,
        det_cantidad: d.det_cantidad,
        det_precio: d.det_precio
      }))
    };

    this.pedidoService.crearPedido(data).subscribe({
      next: async () => {
        await this.showToast('¡Pedido registrado con éxito!', 'success');
        this.router.navigate(['/principal']);
      },
      error: (err: { error: { mensaje: any; }; }) => { 
        console.error(err);
        this.showToast(err.error?.mensaje || 'Error al registrar el pedido', 'danger');
      }
    });
  }

  async showToast(msg: string, color: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 2200, color });
    t.present();
  }
}