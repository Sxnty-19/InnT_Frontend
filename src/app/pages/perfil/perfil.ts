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

  documentos: any[] = [];
  tiposDocumentos: any[] = [];

  constructor(private cd: ChangeDetectorRef, private fb: FormBuilder, private documentoservice: DocumentoService, private tipodocumentoservice: TipoDocumentoService, private usuarioservice: UsuarioService) { }

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
      next: () => alert("Usuario actualizado correctamente, Los cambios se reflejarán al iniciar sesión nuevamente"),
      error: (err) => {
        console.error(err);
        alert(err.error.detail);
        this.cargarDatosUsuario();
        this.cd.detectChanges();
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
    const confirmar = confirm("¿Seguro que deseas eliminar este documento?");

    if (!confirmar) return;

    this.documentoservice.delete_documento(id_documento).subscribe({
      next: () => {
        alert("Documento eliminado correctamente");
        this.cargarDocumentos();
        this.cd.detectChanges();
      },

      error: (err) => {
        console.error(err);
        alert(err.error.detail || "Error al eliminar documento");
      }
    });
  }

  crearDocumento() {
    if (!this.usuarioActual) return;

    const payload = {
      ...this.documentoForm.value,
      id_usuario: this.usuarioActual["id_usuario"]
    };

    this.documentoservice.create_documento(payload).subscribe({
      next: () => {
        alert("Documento creado");
        this.documentoForm.reset({ estado: 1 });
        this.cargarDocumentos();
        this.cd.detectChanges();
      },
      error: (err) => console.error('Error al crear documento:', err)
    });
  }
}
