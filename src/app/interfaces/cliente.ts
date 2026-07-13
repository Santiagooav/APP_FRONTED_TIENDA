export interface Cliente {
  id: number;
  identificacion: string;
  nombre: string;
  telefono: string;
  correo: string;
  direccion: string;
  pais: string;
  ciudad: string;
  created_at?: string;
}