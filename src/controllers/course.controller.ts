import connection from "../config/connection.js";
import { CourseModel } from "../modules/CourseModel.js";
import type { Request, Response } from "express";

const courseModel = new CourseModel(connection);

export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const result = await courseModel.findAll();
    return res.status(200).json(result as any);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ Error: "Internal server error" });
  }
};

export const getCourse = async (req: Request, res: Response) => {
  const { id } = req.params;

  const exists = await courseModel.exists({ id: id });
  if (!exists) {
    return res.status(404).json({ Error: "Course does not exists" });
  }
  try {
    const course = await courseModel.findById(Number(id));
    return res.status(200).json(course);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ Error: "Internal server error" });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const exits = await courseModel.exists({ id: id });
    if (!exits) {
      return res.status(404).json({ Error: "Course not found" });
    }
    const course = await courseModel.delete(Number(id), "id");
    return res.status(200).json({ Message: "Course deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ Error: "Internal server error" });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  const exits = await courseModel.exists({ id: id });
  if (!exits) {
    return res.status(404).json({ Error: "Course not found" });
  }

  try {
    const course = await courseModel.update(Number(id), data, "id");
    return res
      .status(200)
      .json({ Message: "Course updated successfully", course });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ Error: "Internal server error" });
  }
};
