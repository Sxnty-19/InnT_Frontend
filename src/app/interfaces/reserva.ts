export interface Reserva {
    id_reserva: number;
    id_usuario: number;
    date_start: string;
    date_end: string;
    tiene_ninos: boolean;
    tiene_mascotas: boolean;
    total_cop: number;
    capacidad_total: number;
    estado: boolean;
    date_created: string;
    date_updated: string;
}

export interface ReservaUsuario {
    id_reserva: number;
    date_start: string;
    date_end: string;
    tiene_ninos: boolean;
    tiene_mascotas: boolean;
    total_cop: number;
    capacidad_total: number;
    estado: boolean;
    nombre_completo: string;
}
