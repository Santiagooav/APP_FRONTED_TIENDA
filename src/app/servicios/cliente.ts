import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../interfaces/cliente';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private apiUrl = 'http://localhost:3000/api';
  
  constructor(private http: HttpClient) {}

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/clientes`);
  }

  postCliente(data: Partial<Cliente>): Observable<any> {
    return this.http.post(`${this.apiUrl}/clientes`, data);
  }

  putCliente(id: number, data: Partial<Cliente>): Observable<any> {
    return this.http.put(`${this.apiUrl}/clientes/${id}`, data);
  }

  deleteCliente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clientes/${id}`);
  }
}