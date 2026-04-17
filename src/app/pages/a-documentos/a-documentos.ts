import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../components/navbar/navbar';
import { NavbarA } from '../../components/navbar-a/navbar-a';
import { Footer } from '../../components/footer/footer';
import { Documento as DocumentoService } from '../../services/documento';
import { TipoDocumento as TipoDocumentoService } from '../../services/tipo-documento';
import { DocumentoConTipo } from '../../interfaces/documento';
import { TipoDocumento } from '../../interfaces/tipo-documento';

@Component({
  selector: 'app-a-documentos',
  imports: [CommonModule, FormsModule, Navbar, NavbarA, Footer],
  templateUrl: './a-documentos.html',
  styleUrl: './a-documentos.css',
})
export class ADocumentos implements OnInit {

  constructor(private cd: ChangeDetectorRef, private documentoservice: DocumentoService, private tipodocumentoservice: TipoDocumentoService) { }

  tiposDocumentos: TipoDocumento[] = [];
  documentos: DocumentoConTipo[] = [];
  loadingTipos = true;
  loadingDocumentos = true;
  error: string | null = null;

  nuevoTipo = { nombre: '', descripcion: '' };
  isSubmitting = false;

  activeView: 'tipos' | 'documentos' = 'tipos';

  message = '';
  isSuccess = false;
  showMessage = false;
  isModalActive = false; // Controla la animación de entrada/salida
  private toastTimeout: any;

  ngOnInit(): void {
    this.cargarTiposDocumento();
    this.cargarDocumentos();
  }

// Función para cerrar el mensaje con transición
hideMessageWithTransition() {
  this.isModalActive = false;
  // Esperamos a que la animación de CSS termine antes de quitar el *ngIf
  setTimeout(() => {
    this.showMessage = false;
    this.cd.detectChanges();
  }, 300);
}

// Función principal para mostrar el mensaje
async showFloatingMessage(type: 'success' | 'error', text: string): Promise<void> {
  // Limpiar cualquier timeout previo
  if (this.toastTimeout) clearTimeout(this.toastTimeout);

  this.message = text;
  this.isSuccess = type === 'success';
  this.showMessage = true;
  this.isModalActive = true;
  this.cd.detectChanges();

  // Autocerrado tras 4 segundos (igual que en Perfil)
  this.toastTimeout = setTimeout(() => {
    this.hideMessageWithTransition();
  }, 4000);
}

  cargarTiposDocumento() {
    this.tipodocumentoservice.get_tiposDocumento().subscribe({
      next: (res: any) => {
        this.tiposDocumentos = res.data || [];
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar tipos de documento:', err)
      },
      complete: () => {
        this.loadingTipos = false;
        this.cd.detectChanges();
      }
    });
  }

  // ========================
  // Cargar documentos completos
  // ========================
  cargarDocumentos(): void {
    this.loadingDocumentos = true;

    this.documentoservice.get_documentos_usuarios().subscribe({
      next: (data) => {
        if (!data.success) {
          throw new Error(data.detail ?? 'Error al obtener documentos');
        }
        this.documentos = data.data || [];
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando documentos:', err);
        this.error = 'No se pudieron cargar los documentos registrados.';
        this.cd.detectChanges();
      },
      complete: () => {
        this.loadingDocumentos = false;
        this.cd.detectChanges();
      }
    });
  }

  crearTipo(): void {

    if (!this.nuevoTipo.nombre || !this.nuevoTipo.descripcion) {
      this.showFloatingMessage('error', 'Por favor, complete todos los campos para el nuevo tipo.');
      return;
    }

    if (this.isSubmitting) return;
    this.isSubmitting = true;

    this.tipodocumentoservice.create_tipoDocumento(this.nuevoTipo).subscribe({

      next: async (data) => {

        if (!data.success) {
          throw new Error(data.detail ?? 'El tipo ya existe o hubo un error.');
        }

        await this.showFloatingMessage(
          'success',
          `Tipo '${this.nuevoTipo.nombre}' creado con éxito.`
        );

        this.limpiarNuevo();
        this.cargarTiposDocumento();
      },

      error: (err) => {
        console.error('Error al crear tipo:', err);
        this.showFloatingMessage(
          'error',
          err.message || 'Error al crear el tipo.'
        );
      },

      complete: () => {
        this.isSubmitting = false;
        this.cd.detectChanges();
      }

    });
  }

  limpiarNuevo(): void {
    this.nuevoTipo = { nombre: '', descripcion: '' };
  }

  countDocumentsByType(nombreTipo: string): number {
    if (!this.documentos?.length) return 0;
    return this.documentos.filter(d => d.tipo_documento === nombreTipo).length;
  }

  formatFecha(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('es-CO');
  }
}
