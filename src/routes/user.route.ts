import { Router } from "express";
import {
  getUserById,
  getAllUsers,
  createUser,
  deleteUser,
  updateUser,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);

// Rotas para criar usuário e para deletar/atualizar dados de usuário
router.post("/", createUser);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser);

export default router;
