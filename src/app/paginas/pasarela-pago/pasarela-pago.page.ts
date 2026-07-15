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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  generarFacturaPDF(pedidoData: any, idPedidoCreado: number) {
  const doc = new jsPDF();

  // 1. Encabezado de la Tienda (Estilo Boleta/Factura)
  doc.setFillColor(33, 150, 243); // Color primario (Azul)
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('MI TIENDA ONLINE', 15, 25);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('La Libertad - Santa Elena, Ecuador', 15, 32);

  // 2. Información del Documento
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`FACTURA N°: 001-001-00${idPedidoCreado}`, 140, 55);
  doc.setFont('helvetica', 'normal');
  doc.text(`Fecha: ${pedidoData.ped_fecha || '14/07/2026'}`, 140, 62);

  // 3. Datos del Cliente
  doc.setDrawColor(220, 220, 220);
  doc.line(15, 48, 195, 48); // Línea divisoria

  doc.setFont('helvetica', 'bold');
  doc.text('DATOS DEL CLIENTE:', 15, 55);
  doc.setFont('helvetica', 'normal');
  doc.text(`Identificación: ${pedidoData.identificacion}`, 15, 62);
  doc.text(`Cliente: ${pedidoData.nombre}`, 15, 68);
  doc.text(`Correo: ${pedidoData.correo}`, 15, 74);
  doc.text(`Dirección: ${pedidoData.direccion}`, 15, 80);

  // 4. Detalle de Productos (Estructura de Tabla Dinámica)
  const columnas = ['Producto ID', 'Cantidad', 'Precio Unitario', 'Subtotal'];
  const filas = pedidoData.detalle.map((det: any) => [
    `Prod #${det.id_producto}`,
    det.det_cantidad,
    `$${det.det_precio.toFixed(2)}`,
    `$${(det.det_cantidad * det.det_precio).toFixed(2)}`
  ]);

  // Se añade la tabla elegante usando jspdf-autotable
  autoTable(doc, {
    startY: 88,
    head: [columnas],
    body: filas,
    theme: 'striped',
    headStyles: { fillColor: [33, 150, 243] }, // Color azul a juego
    styles: { fontSize: 10, cellPadding: 4 }
  });

  // 5. Cálculo del Total
  const totalFactura = pedidoData.detalle.reduce((sum: number, item: any) => sum + (item.det_precio * item.det_cantidad), 0);
  const finalY = (doc as any).lastAutoTable.finalY + 15; // Obtiene el final de la tabla de forma segura

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`TOTAL GENERAL A PAGAR: $${totalFactura.toFixed(2)}`, 115, finalY);

  // 6. Descarga del archivo PDF
  doc.save(`Factura_Pedido_${idPedidoCreado}.pdf`);
  }
}