import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Navbar } from '../../components/navbar/navbar';
import { NavbarA } from '../../components/navbar-a/navbar-a';
import { Footer } from '../../components/footer/footer';
import { Documento as DocumentoService } from '../../services/documento';
import { TipoDocumento as TipoDocumentoService } from '../../services/tipo-documento';
import { Usuario as UsuarioService } from '../../services/usuario';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule, ReactiveFormsModule, Navbar, NavbarA, Footer],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil {

  perfilForm!: FormGroup;
  documentoForm!: FormGroup;

  usuarioActual: any;

  // --- Lógica de Mensajes (Toasts) ---
  showSuccessToast: boolean = false;
  showErrorToast: boolean = false;
  toastMessage: string = '';

  documentos: any[] = [];
  tiposDocumentos: any[] = [];

  // Botón activo para las pestañas
  activeTab: 'datos' | 'documentos' = 'datos';

  // --- Estado para el Modal de Eliminación ---
  isConfirmingDelete = false;
  idDocumentoAEliminar: number | null = null;

  constructor(
    private cd: ChangeDetectorRef, 
    private fb: FormBuilder, 
    private documentoservice: DocumentoService, 
    private tipodocumentoservice: TipoDocumentoService, 
    private usuarioservice: UsuarioService
  ) { }

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      primer_nombre: ['', Validators.required],
      segundo_nombre: [''],
      primer_apellido: ['', Validators.required],
      segundo_apellido: ['', Validators.required],
      telefono: [''],
      correo: ['']
    });

    this.documentoForm = this.fb.group({
      id_tdocumento: ['', Validators.required],
      numero_documento: ['', Validators.required],
      lugar_expedicion: ['', Validators.required],
      estado: [true]
    });

    this.cargarDatosUsuario();
    this.cargarTiposDocumento();
  }

  // --- Función auxiliar para disparar Toasts ---
  private triggerToast(mensaje: string, tipo: 'success' | 'error') {
    this.toastMessage = mensaje;
    if (tipo === 'success') {
      this.showSuccessToast = true;
      this.showErrorToast = false;
    } else {
      this.showErrorToast = true;
      this.showSuccessToast = false;
    }

    this.cd.detectChanges();

    // Se oculta automáticamente tras 4 segundos
    setTimeout(() => {
      this.showSuccessToast = false;
      this.showErrorToast = false;
      this.cd.detectChanges();
    }, 4000);
  }

  cargarDatosUsuario() {
    this.usuarioservice.get_usuario_id().subscribe((res: any) => {
      const user = res.data;
      this.usuarioActual = user;

      this.perfilForm.patchValue({
        primer_nombre: user["primer_nombre"],
        segundo_nombre: user["segundo_nombre"],
        primer_apellido: user["primer_apellido"],
        segundo_apellido: user["segundo_apellido"],
        telefono: user["telefono"],
        correo: user["correo"]
      });

      this.cargarDocumentos();
      this.cd.detectChanges();
    });
  }

  actualizarUsuario() {
    const data = this.perfilForm.value;
    this.usuarioservice.update_usuario(data).subscribe({
      next: () => {
        this.triggerToast("Usuario actualizado correctamente. Los cambios se reflejarán en tu próxima sesión.", "success");
      },
      error: (err) => {
        console.error(err);
        this.triggerToast(err.error.detail || "Error al actualizar usuario", "error");
        this.cargarDatosUsuario();
      }
    });
  }

  cargarTiposDocumento() {
    this.tipodocumentoservice.get_tiposDocumento().subscribe({
      next: (res: any) => {
        this.tiposDocumentos = res.data || [];
        this.cd.detectChanges();
      },
      error: (err) => console.error('Error al cargar tipos de documento:', err)
    });
  }

  cargarDocumentos() {
    if (!this.usuarioActual) return;

    this.documentoservice.get_documentos_usuario().subscribe({
      next: (res: any) => {
        this.documentos = res.data.filter((d: any) =>
          d.id_usuario === this.usuarioActual[0]
        );
        this.cd.detectChanges();
      },
      error: (err) => console.error('Error al cargar documentos:', err)
    });
  }

  eliminarDocumento(id_documento: number) {
    this.idDocumentoAEliminar = id_documento;
    this.isConfirmingDelete = true;
    this.cd.detectChanges();
  }

  confirmarEliminacion() {
    if (this.idDocumentoAEliminar === null) return;

    this.documentoservice.delete_documento(this.idDocumentoAEliminar).subscribe({
      next: () => {
        this.isConfirmingDelete = false;
        this.idDocumentoAEliminar = null;
        this.triggerToast("Documento eliminado correctamente", "success");
        this.cargarDocumentos();
      },
      error: (err) => {
        this.isConfirmingDelete = false;
        console.error(err);
        this.triggerToast(err.error.detail || "Error al eliminar documento", "error");
      }
    });
  }

  crearDocumento() {
    if (!this.usuarioActual) return;

    const id = Array.isArray(this.usuarioActual) ? this.usuarioActual[0].id_usuario : this.usuarioActual.id_usuario;
    const formValues = this.documentoForm.value;
    
    const payload = {
      id_tdocumento: Number(formValues.id_tdocumento),
      numero_documento: formValues.numero_documento.toString(),
      lugar_expedicion: formValues.lugar_expedicion,
      estado: formValues.estado ? 1 : 0, 
      id_usuario: id
    };

    this.documentoservice.create_documento(payload).subscribe({
      next: () => {
        this.triggerToast("Documento agregado exitosamente", "success");
        this.documentoForm.reset({ estado: true });
        this.cargarDocumentos();
      },
      error: (err) => {
        console.error('Error:', err);
        const mensaje = err.error?.detail || "Revisa que los datos sean correctos";
        this.triggerToast(mensaje, "error");
      }
    });
  }
}