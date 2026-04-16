export interface Documento {
    id_documento: number;
    id_tdocumento: number;
    id_usuario: number;
    numero_documento: string;
    lugar_expedicion: string;
    url_imagen: string;
    documento_validado: boolean;
    estado: boolean;
    date_created: string;
    date_updated: string;
}

export interface DocumentoConTipo {
    id_documento: number;
    tipo_documento: string;
    numero_documento: string;
    lugar_expedicion: string;
    nombre_completo: string;
    documento_validado: boolean;
}
