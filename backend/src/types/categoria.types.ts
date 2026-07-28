import { z } from "zod";

export const crearCategoriaSchema = z.object({
  nombre: z.string().min(2).max(100),
  descripcion: z.string().max(255).optional(),
});

export const actualizarCategoriaSchema = crearCategoriaSchema.partial();

export type CrearCategoriaDTO = z.infer<typeof crearCategoriaSchema>;
export type ActualizarCategoriaDTO = z.infer<typeof actualizarCategoriaSchema>;
