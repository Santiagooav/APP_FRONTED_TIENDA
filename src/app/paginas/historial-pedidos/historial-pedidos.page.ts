import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, 
  IonButtons, IonList, IonItem, IonLabel, IonButton, IonIcon, 
  IonBadge, LoadingController, ToastController 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  receiptOutline, downloadOutline, chevronDownOutline, 
  chevronUpOutline, calendarOutline, personOutline, documentTextOutline 
} from 'ionicons/icons';
import { PedidoService } from '../../servicios/pedidos';
// Motor PDF
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-historial-pedidos',
  templateUrl: './historial-pedidos.page.html',
  styleUrls: ['./historial-pedidos.page.scss'],
  standalone: true,
  providers: [DatePipe],
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, 
    IonButtons, IonList, IonItem, IonLabel, IonButton, IonIcon, 
    IonBadge, CommonModule, FormsModule
  ]
})
export class HistorialPedidosPage implements OnInit {
  pedidos: any[] = [];
  pedidoExpandidoId: number | null = null; // Controla qué acordeón de detalles está abierto

  constructor(
    private pedidoService: PedidoService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private datePipe: DatePipe
  ) {
    addIcons({ 
      receiptOutline, downloadOutline, chevronDownOutline, 
      chevronUpOutline, calendarOutline, personOutline, documentTextOutline 
    });
  }

  ngOnInit() {
    this.cargarHistorial();
  }

  async showToast(msg: string, color: string) {
    const toast = await this.toastCtrl.create({ message: msg, duration: 2000, color });
    await toast.present();
  }

  async cargarHistorial() {
    const loader = await this.loadingCtrl.create({ message: 'Cargando historial de pedidos...' });
    await loader.present();

    this.pedidoService.obtenerPedidos().subscribe({
      next: (res: any) => {
        loader.dismiss();
        if (res.ok) {
          this.pedidos = res.data; // Se asume que el backend devuelve un arreglo de pedidos con sus detalles
        } else {
          this.showToast('No se encontraron pedidos.', 'warning');
        }
      },
      error: (err) => {
        loader.dismiss();
        this.showToast('Error al conectar con el servidor.', 'danger');
        console.error(err);
      }
    });
  }

  // Contrae o expande la sección de detalles del pedido
  toggleDetalles(pedidoId: number) {
    if (this.pedidoExpandidoId === pedidoId) {
      this.pedidoExpandidoId = null;
    } else {
      this.pedidoExpandidoId = pedidoId;
    }
  }

  // Calcula el total sumando los subtotales de cada detalle de forma local por seguridad
  calcularTotalPedido(detalles: any[]): number {
    return detalles.reduce((acc, item) => acc + (item.det_precio * item.det_cantidad), 0);
  }

  // Generación dinámica y descarga del PDF para el pedido seleccionado
 async descargarFacturaPDF(pedido: any) {
    const loader = await this.loadingCtrl.create({ message: 'Generando PDF...' });
    await loader.present();

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const totalFactura = this.calcularTotalPedido(pedido.detalles);

      // 1. Encabezado de la Factura (Fondo Azul)
      doc.setFillColor(33, 150, 243);
      doc.rect(0, 0, 210, 35, 'F');

      // Texto del Encabezado
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.text('FACTURA COMERCIAL', 15, 20);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('Tienda de Calzado y Ropa S.A.', 15, 27);

      // 2. Información de la Factura (Derecha)
      doc.setTextColor(80, 80, 80);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(`FACTURA N°: 001-001-00${pedido.ped_id}`, 140, 48);
      
      doc.setFont('helvetica', 'normal');
      const fechaFormateada = this.datePipe.transform(pedido.ped_fecha, 'dd/MM/yyyy') || pedido.ped_fecha;
      doc.text(`Fecha Emisión: ${fechaFormateada}`, 140, 54);

      // Línea divisoria superior
      doc.setDrawColor(220, 220, 220);
      doc.line(15, 40, 195, 40);

      // 3. Datos del Cliente
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('DATOS DEL CLIENTE', 15, 48);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.text(`Identificación: ${pedido.identificacion || 'S/N'}`, 15, 54);
      doc.text(`Nombre: ${(pedido.nombre || 'Consumidor Final').toUpperCase()}`, 15, 60);
      doc.text(`Teléfono: ${pedido.telefono || 'S/N'}`, 15, 66);
      doc.text(`Correo: ${pedido.correo || 'S/N'}`, 15, 72);
      doc.text(`Dirección: ${pedido.direccion || 'S/N'}`, 15, 78);

      // Línea divisoria inferior de datos del cliente
      doc.line(15, 84, 195, 84);

      // 4. Tabla de Detalles de Productos
      const cabecera = [['Producto', 'Cantidad', 'Precio Unitario', 'Subtotal']];
      const cuerpo = pedido.detalles.map((item: any) => [
        item.nombre_producto || `Producto ID: ${item.id_producto}`,
        item.det_cantidad,
        `$${Number(item.det_precio).toFixed(2)}`,
        `$${(Number(item.det_cantidad) * Number(item.det_precio)).toFixed(2)}`
      ]);

      // Generar la tabla estructurada automáticamente
      autoTable(doc, {
        startY: 90,
        head: cabecera,
        body: cuerpo,
        theme: 'striped',
        headStyles: { fillColor: [33, 150, 243], textColor: [255, 255, 255], fontStyle: 'bold' },
        styles: { fontSize: 9.5, cellPadding: 3 },
        columnStyles: {
          1: { halign: 'center' }, // Cantidad centrada
          2: { halign: 'right' },  // Precio alineado a la derecha
          3: { halign: 'right' }   // Subtotal alineado a la derecha
        }
      });

      // Obtener la posición Y final después de pintar la tabla de forma segura
      const finalY = (doc as any).lastAutoTable.finalY + 12;

      // 5. Total de la Factura (Alineado a la derecha)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(33, 150, 243);
      doc.text(`TOTAL A PAGAR: $${totalFactura.toFixed(2)}`, 135, finalY);

      // 6. Pie de Página informativo
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8.5);
      doc.setTextColor(120, 120, 120);
      doc.text('Este documento es un comprobante de respaldo electrónico de su compra.', 15, finalY + 15);

      // 7. Guardar/Descargar el archivo PDF
      doc.save(`Factura_Orden_${pedido.ped_id}.pdf`);
      
      loader.dismiss();
      this.showToast('Factura generada y descargada con éxito', 'success');

    } catch (error) {
      loader.dismiss();
      console.error('Error al generar el PDF:', error);
      this.showToast('Ocurrió un error al generar el documento PDF.', 'danger');
    }
  }

}