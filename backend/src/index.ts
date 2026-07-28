import "dotenv/config";

import cors from "cors";
import express, { Request, Response } from "express";
import { errorHandler } from "./middlewares/errorHandler";
import authRoutes from "./routes/auth.routes";
import categoriaRoutes from "./routes/categoria.routes";
import movimientoRoutes from "./routes/movimiento.routes";
import productoRoutes from "./routes/producto.routes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ ok: true, mensaje: "API Kinal Inventario funcionando" });
});

app.use("/api/auth", authRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/movimientos", movimientoRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
