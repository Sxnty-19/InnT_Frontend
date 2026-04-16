export interface Habitacion {
    id_habitacion: number
    id_thabitacion: number
    numero: string
    limpieza: boolean
    estado: boolean
    date_created: string
    date_updated: string
}

export interface HabitacionDisponible extends Pick<Habitacion,
    'id_habitacion' | 'numero'
> {
    tipo_habitacion: string
    capacidad_max: number
    precio_x_dia: number
}
