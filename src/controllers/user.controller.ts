import connection from "../config/connection.js";
import { UserModel } from "../modules/UserModel.js";
import type { Request, Response } from "express";

const userModel = new UserModel(connection);

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await userModel.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }   
}

export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const user = await userModel.findById(Number(id));
        if(!user) {
            res.status(404).json({ Error: "User not found" });
            return;
        }
        
        res.status(200).json(user);
    } catch (err){
        console.log(err);
        res.status(500).json({ Error: "Internal Server Error" });   
    }
}