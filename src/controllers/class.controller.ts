import connection from "../config/connection.js";
import { ClassModel } from "../modules/ClassModel.js";
import type { Request, Response } from "express";

const classModel = new ClassModel(connection);

export const getAllClasses = async (req: Request, res: Response) => {
  try {
    const result = await classModel.findAll();
    return res.status(200).json(result as any);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ Error: "Internal server error" });
  }
};

export const getClass = async (req: Request, res: Response) => {
  const { id } = req.params;

  const exists = await classModel.exists({ id: id });
  if (!exists) {
    return res.status(404).json({ Error: "Class does not exists" });
  }
  try {
    const course = await classModel.findById(Number(id));
    return res.status(200).json(course);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ Error: "Internal server error" });
  }
};

export const createClass = async (req: Request, res: Response) => {
  const data = req.body;

  const validFields = await classModel.validateFields(data);
  const requiredFields = await classModel.validateRequiredFields(data);

  if (validFields.length || requiredFields.length) {
    return res.status(400).json({ Error: "Missing required or valid fields" });
  }

  try {
    const classContent = await classModel.create(data);

    return res
      .status(201)
      .json({ Message: "Class successfully created", classContent });
  } catch (err) {
    console.log(err);
    res.status(500).json({ Error: "Internal Server Error" });
  }
};

export const deleteClass = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const exits = await classModel.exists({ id: id });
    if (!exits) {
      return res.status(404).json({ Error: "Class not found" });
    }
    const Class = await classModel.delete(Number(id), "id");
    return res.status(200).json({ Message: "Class deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ Error: "Internal server error" });
  }
};

export const updateClass = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  const exits = await classModel.exists({ id: id });
  if (!exits) {
    return res.status(404).json({ Error: "Class not found" });
  }

  try {
    const Class = await classModel.update(Number(id), data, "id");
    return res
      .status(200)
      .json({ Message: "Class updated successfully", Class });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ Error: "Internal server error" });
  }
};
