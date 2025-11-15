import connection from "../config/connection.js";
import { UserModel } from "../modules/UserModel.js";
import { AssociatedModel } from "../modules/AssociatedModel.js";
import type { Request, Response } from "express";

const userModel = new UserModel(connection);
const associatedModel = new AssociatedModel(connection);

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userModel.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await userModel.findById(Number(id));
    if (!user) {
      res.status(404).json({ Error: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ Error: "Internal Server Error" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { id, name, email, password } = req.body;
    const user = await userModel.create({
      name: name,
      email: email,
      password: password,
    });
    const associated = await associatedModel.create({
      id_user: user.insertId,
      id_profile: id,
    });

    return res
      .status(201)
      .json({ Message: "User successfully created", user, associated });
  } catch (err) {
    console.log(err);
    res.status(500).json({ Error: "Internal Server Error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const exists = await userModel.findById(Number(id));
  if (!exists) {
    return res.status(404).json({ Error: "User not found" });
  }
  try {
    const associated = await associatedModel.delete(Number(id), "id_user");
    const user = await userModel.delete(Number(id), "id");
    return res
      .status(200)
      .json({ Message: "User deleted successfully", user, associated });
  } catch (err) {
    console.log(err);
    res.status(500).json({ Error: "Internal Server Error" });
  }
};
