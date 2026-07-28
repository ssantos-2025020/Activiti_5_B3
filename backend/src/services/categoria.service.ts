import { prisma } from "../config/prisma";
import { AppError } from "../middlewares/errorHandler";
import {
  ActualizarCategoriaDTO,
  CrearCategoriaDTO,
} from "../types/categoria.types";

export const categoriaService = {
  async listar() {
    return prisma.categoria.findMany({
      orderBy: { nombre: "asc" },
      include: { _count: { select: { productos: true } } },
    });
  },

  async obtenerPorId(id: number) {
    const categoria = await prisma.categoria.findUnique({
      where: { id },
      include: { productos: true },
    });

    if (!categoria) {
      throw new AppError(`Categoría con id ${id} no encontrada`, 404);
    }
    return categoria;
  },

  async crear(data: CrearCategoriaDTO) {
    const existente = await prisma.categoria.findUnique({
      where: { nombre: data.nombre },
    });
    if (existente) {
      throw new AppError(`Ya existe una categoría llamada "${data.nombre}"`, 409);
    }
    return prisma.categoria.create({ data });
  },

  async actualizar(id: number, data: ActualizarCategoriaDTO) {
    await this.obtenerPorId(id);
    return prisma.categoria.update({ where: { id }, data });
  },

  async eliminar(id: number) {
    await this.obtenerPorId(id);

    const productosAsociados = await prisma.producto.count({
      where: { categoriaId: id },
    });
    if (productosAsociados > 0) {
      throw new AppError(
        "No se puede eliminar: la categoría tiene productos asociados",
        409
      );
    }

    await prisma.categoria.delete({ where: { id } });
    return { id };
  },
};
