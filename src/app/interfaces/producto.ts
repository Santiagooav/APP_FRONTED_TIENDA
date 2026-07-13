export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  created_at?: string;
  prod_imagen?: string;
}