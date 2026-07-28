import { prisma } from "../config/prisma";
import { AppError } from "../middlewares/errorHandler";
import { CrearMovimientoDTO } from "../types/movimiento.types";

export const movimientoService = {
  async listar() {
    return prisma.movimiento.findMany({
      orderBy: { fecha: "desc" },
      include: { producto: { select: { id: true, nombre: true } } },
    });
  },

  async listarPorProducto(productoId: number) {
    return prisma.movimiento.findMany({
      where: { productoId },
      orderBy: { fecha: "desc" },
    });
  },

  async crear(data: CrearMovimientoDTO) {
    const producto = await prisma.producto.findUnique({
      where: { id: data.productoId },
    });
    if (!producto) {
      throw new AppError(`El producto ${data.productoId} no existe`, 400);
    }

    if (data.tipo === "SALIDA" && producto.stock < data.cantidad) {
      throw new AppError(
        `Stock insuficiente. Disponible: ${producto.stock}, solicitado: ${data.cantidad}`,
        409
      );
    }

    const nuevoStock =
      data.tipo === "ENTRADA"
        ? producto.stock + data.cantidad
        : producto.stock - data.cantidad;

    const [movimiento] = await prisma.$transaction([
      prisma.movimiento.create({ data }),
      prisma.producto.update({
        where: { id: data.productoId },
        data: { stock: nuevoStock },
      }),
    ]);

    return movimiento;
  },
};
