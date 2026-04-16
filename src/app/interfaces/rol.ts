export interface Rol {
    id_rol: number
    nombre: string
    descripcion: string
    estado: boolean
    date_created: string
    date_updated: string
}

export interface RolBasico {
    id_rol: number
    nombre: string
    estado: boolean
}