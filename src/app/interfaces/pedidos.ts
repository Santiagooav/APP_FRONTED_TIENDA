export interface Ipedido{
    id_cliente: number;
    id_usuario: number;
    ped_estado: string;
    detalles: Idetalle [];
}

export interface Idetalle {
    id_producto: number;
    det_cantidad: number;
    det_precio: number;
}