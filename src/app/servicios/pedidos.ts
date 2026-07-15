import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  crearPedido(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/pedidos`, data);
  }
  buscarClientePorCedula(identificacion: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/clientes/buscar/${identificacion}`);
  }

  guardarPedido(pedido: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/pedidos`, pedido);
  }

  // Obtener todos los pedidos registrados en el sistema (puedes filtrar por id_usuario si lo requieres)
  obtenerPedidos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/pedidos`); // Ajusta la URL según tu API de backend
  }

}