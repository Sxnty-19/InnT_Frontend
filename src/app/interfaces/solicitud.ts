export interface Solicitud {
    id_solicitud: number
    id_usuario: number
    id_habitacion: number
    descripcion: string
    estado: boolean
    date_created: string
    date_updated: string
}

export interface SolicitudConHabitacion extends Solicitud {
    numero_habitacion: string;
}
