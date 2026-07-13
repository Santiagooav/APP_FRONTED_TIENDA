import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../interfaces/producto';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private apiUrl = 'http://localhost:3000/api';
  
  constructor(private http: HttpClient) {}

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${`${this.apiUrl}/productos`}`);
  }

  // Recibe FormData para admitir textos e imágenes adjuntas
  postProducto(data: FormData): Observable<any> {
    return this.http.post(`${`${this.apiUrl}/productos`}`, data);
  }

  // Recibe ID y FormData para actualizar
  putProducto(id: number, data: FormData): Observable<any> {
    return this.http.put(`${`${this.apiUrl}/productos/${id}`}`, data);
  }

  deleteProducto(id: number): Observable<any> {
    return this.http.delete(`${`${this.apiUrl}/productos/${id}`}`);
  }
}