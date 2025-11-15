import connection from "../config/connection.js";
import { UserModel } from "../modules/UserModel.js";
import { AssociatedModel } from "../modules/AssociatedModel.js";
import type { Request, Response } from "express";
import bcrypt from "bcrypt"

const userModel = new UserModel(connection);
const associatedModel = new AssociatedModel(connection);

// Consultas Gerais
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

// Administradores: a) Cadastrar e gerenciar usuários (professores, alunos e outros administradores).
export const createUser = async (req: Request, res: Response) => {
  const { profiles, name, email, password } = req.body;
  const missingFields = await userModel.validateRequiredFields(req.body);
  const invalidFields = await userModel.validateFields(req.body);
  if (invalidFields.length > 0) {
    return res
      .status(400)
      .json({
        Status: 400,
        Response: `${invalidFields
          .map((field) => `'${field}'`)
          .join(" and ")} are invalid fields.`,
      });
  } else if (missingFields.length > 0) {
    return res
      .status(400)
      .json({ Status: 400, Response: "Missing required fields." });
  }

  try {
    if (!Array.isArray(profiles) || profiles.length === 0) {
      return res.status(400).json({
        Error: "Field 'profiles' must be a non-empty array",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const associated = await Promise.all(
      profiles.map((profileId: number) =>
        associatedModel.create({
          id_user: user.insertId,
          id_profile: profileId,
        })
      )
    );

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
    const user = await userModel.delete(Number(id), "id");
    return res.status(200).json({ Message: "User deleted successfully", user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ Error: "Internal Server Error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { profiles, ...userData } = req.body;

  const exists = await userModel.findById(Number(id));
  if (!exists) {
    return res.status(404).json({ Error: "User not found" });
  }

  try {
    let associatedResult = null;

    if (Array.isArray(profiles)) {
      await associatedModel.delete(Number(id), "id_user");

      // insere novos perfis
      associatedResult = await Promise.all(
        profiles.map((profileId: number) =>
          associatedModel.create({
            id_user: Number(id),
            id_profile: profileId,
          })
        )
      );
    }

    const user = await userModel.update(Number(id), userData, "id");

    return res.status(200).json({
      Message: "User updated successfully",
      user,
      associated: associatedResult,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ Error: "Internal Server Error" });
  }
};
