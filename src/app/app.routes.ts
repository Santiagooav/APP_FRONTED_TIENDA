import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./paginas/login/login.page').then(m => m.LoginPage) },
  { path: 'principal', loadComponent: () => import('./paginas/principal/principal.page').then(m => m.PrincipalPage) },
  { path: 'listado-clientes', loadComponent: () => import('./paginas/listado-clientes/listado-clientes.page').then(m => m.ListadoClientesPage) },
  { path: 'listado-productos', loadComponent: () => import('./paginas/listado-productos/listado-productos.page').then(m => m.ListadoProductosPage) },
  {
    path: 'catalogo',
    loadComponent: () => import('./paginas/catalogo/catalogo.page').then( m => m.CatalogoPage)
  },
  {
    path: 'detalle-pedido',
    loadComponent: () => import('./paginas/detalle-pedido/detalle-pedido.page').then( m => m.DetallePedidoPage)
  },
  {
    path: 'pasarela-pago',
    loadComponent: () => import('./paginas/pasarela-pago/pasarela-pago.page').then( m => m.PasarelaPagoPage)
  },
  {
    path: 'historial-pedidos',
    loadComponent: () => import('./paginas/historial-pedidos/historial-pedidos.page').then( m => m.HistorialPedidosPage)
  },
];