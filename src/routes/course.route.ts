import { Router } from "express";
import {
  deleteCourse,
  getAllCourses,
  getCourse,
  updateCourse,
} from "../controllers/course.controller.js";

const router = Router();

router.get("/:id", getCourse);
router.delete("/:id", deleteCourse);
router.put("/:id", updateCourse);
router.get("/", getAllCourses);

export default router;
