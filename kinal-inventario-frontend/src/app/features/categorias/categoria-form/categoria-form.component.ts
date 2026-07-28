import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { CategoriaService } from "../../../core/services/categoria.service";

@Component({
  selector: "app-categoria-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: "./categoria-form.component.html",
  styleUrl: "./categoria-form.component.css",
})
export class CategoriaFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private categoriaService = inject(CategoriaService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  modoEdicion = false;
  categoriaId?: number;
  cargando = false;
  errorMensaje = "";

  formulario = this.fb.group({
    nombre: ["", [Validators.required, Validators.minLength(2)]],
    descripcion: [""],
  });

  get nombre() {
    return this.formulario.get("nombre")!;
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get("id");
    if (idParam) {
      this.modoEdicion = true;
      this.categoriaId = Number(idParam);
      this.cargarCategoria(this.categoriaId);
    }
  }

  cargarCategoria(id: number): void {
    this.cargando = true;
    this.categoriaService.obtener(id).subscribe({
      next: (res) => {
        if (res.data) {
          this.formulario.patchValue({
            nombre: res.data.nombre,
            descripcion: res.data.descripcion,
          });
        }
        this.cargando = false;
      },
      error: () => {
        this.errorMensaje = "No se pudo cargar la categoría";
        this.cargando = false;
      },
    });
  }

  guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const datos = {
      nombre: this.formulario.value.nombre!,
      descripcion: this.formulario.value.descripcion || undefined,
    };

    const peticion = this.modoEdicion
      ? this.categoriaService.actualizar(this.categoriaId!, datos)
      : this.categoriaService.crear(datos);

    this.cargando = true;
    peticion.subscribe({
      next: () => this.router.navigate(["/categorias"]),
      error: (err) => {
        this.cargando = false;
        this.errorMensaje = err.error?.mensaje || "No se pudo guardar la categoría";
      },
    });
  }
}
