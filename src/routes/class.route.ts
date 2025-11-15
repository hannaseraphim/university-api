import { Router } from "express";
import {
  deleteClass,
  getAllClasses,
  getClass,
  updateClass,
  createClass
} from "../controllers/class.controller.js";

const router = Router();

router.get("/", getAllClasses);
router.get("/:id", getClass);
router.delete("/:id", deleteClass);
router.post("/", createClass);
router.put("/:id", updateClass);

export default router;
