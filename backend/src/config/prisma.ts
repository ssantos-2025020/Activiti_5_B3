// Creamos UNA sola instancia de PrismaClient y la reutilizamos en toda
// la app. Crear una instancia por cada archivo agotaría las conexiones
// a la base de datos.
import dotenv from "dotenv";
import path from "path";
import { PrismaClient } from "@prisma/client";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const prisma = new PrismaClient({
  // Descomenta la siguiente línea si quieres ver en consola cada SQL generado:
  // log: ["query", "info", "warn", "error"],
});
