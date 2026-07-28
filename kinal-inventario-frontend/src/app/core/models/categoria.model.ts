export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  creadoEn?: string;
  actualizadoEn?: string;
  _count?: { productos: number };
}

export type CategoriaForm = Omit<Categoria, "id" | "creadoEn" | "actualizadoEn" | "_count">;
