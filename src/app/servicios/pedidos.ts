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
}