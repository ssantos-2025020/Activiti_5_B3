import { Router } from "express";
import {
  actualizarCategoria,
  crearCategoria,
  eliminarCategoria,
  listarCategorias,
  obtenerCategoria,
} from "../controllers/categoria.controller";
import { verificarToken } from "../middlewares/auth";

const router = Router();

router.get("/", listarCategorias);
router.get("/:id", obtenerCategoria);

router.post("/", verificarToken, crearCategoria);
router.put("/:id", verificarToken, actualizarCategoria);
router.delete("/:id", verificarToken, eliminarCategoria);

export default router;
