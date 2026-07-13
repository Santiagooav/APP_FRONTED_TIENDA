import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, 
  IonButtons, IonList, IonItem, IonLabel, IonFooter, IonButton, IonIcon 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline } from 'ionicons/icons';
import { Ipedido, Idetalle } from '../../interfaces/pedidos';

@Component({
  selector: 'app-detalle-pedido',
  templateUrl: './detalle-pedido.page.html',
  styleUrls: ['./detalle-pedido.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, 
    IonButtons, IonList, IonItem, IonLabel, IonFooter, IonButton, IonIcon, CommonModule
  ]
})
export class DetallePedidoPage implements OnInit {
  pedido: Ipedido | null = null;
  detalles: Idetalle[] = []; // Corregido: error de tipeo eliminado por completo

  constructor(private router: Router) {
    addIcons({ checkmarkCircleOutline });
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['pedido']) {
      this.pedido = navigation.extras.state['pedido'];
      this.detalles = this.pedido ? this.pedido.detalles : [];
    }
  }

  ngOnInit() {}

  calcularTotal(): number {
    // Corregido: se añade ": number" al acumulador 'acc' para complacer las restricciones estrictas de TypeScript
    return this.detalles.reduce((acc: number, item) => acc + (item.det_precio * item.det_cantidad), 0);
  }

  confirmarPedido() {
    if (this.pedido) {
      this.router.navigate(['/pasarela-pago'], { state: { pedido: this.pedido } });
    }
  }

  cancelarPedido() {
    this.router.navigate(['/catalogo']);
  }
}