import { Router } from "express";
import { getUserById, getAllUsers } from "../controllers/user.controller.js";

const router = Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);

export default router;