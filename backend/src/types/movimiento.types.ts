import { z } from "zod";

export const crearMovimientoSchema = z.object({
  tipo: z.enum(["ENTRADA", "SALIDA"]),
  cantidad: z.number().int().positive("La cantidad debe ser mayor a 0"),
  motivo: z.string().max(255).optional(),
  productoId: z.number().int().positive("Debes indicar un producto válido"),
});

export type CrearMovimientoDTO = z.infer<typeof crearMovimientoSchema>;
