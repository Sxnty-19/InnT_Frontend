export interface Usuario {
    id_usuario: number;
    id_rol: number;
    primer_nombre: string;
    segundo_nombre: string;
    primer_apellido: string;
    segundo_apellido: string;
    telefono: string;
    correo: string;
    username: string;
    password: string;
    estado: boolean;
    date_created: string;
    date_updated: string;
}

export interface UsuarioConRol {
    id_usuario: number;
    primer_nombre: string;
    segundo_nombre: string;
    primer_apellido: string;
    segundo_apellido: string;
    telefono: string;
    correo: string;
    username: string;
    id_rol: number;
    estado: boolean;
    nombre_rol: string;
}