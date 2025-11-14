import connection from "../config/connection.js";
import { UserModel } from "../modules/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";    
import type { Request, Response } from "express";
const userModel = new UserModel(connection);


export const AuthController = {
    login: async (req: Request, res: Response) => {
        const { email, password } = req.body;

        const cookie = req.cookies['session_token'];
        if (cookie) {
            return res.status(400).json({ Error: "Already logged in" });
        }

        if (!email || !password) {
            return res.status(400).json({ Error: "Email and password are required" });
        }

        const exists = await userModel.exists({ email: email });
        if (!exists) {
            return res.status(401).json({ Error: "Invalid email or password" });
        }

        const user = await userModel.findByEmail(email);

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ Error: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET as string, { expiresIn: '24h' });

        res.cookie("session_token", token, { httpOnly: true, secure: false, sameSite: "lax", maxAge: 60 * 60 * 24000 });

        return res.status(200).json({ Message: "Logged in successfully", Token: token });
    },

    logout: async (req: Request, res: Response) => {
        const cookie = req.cookies['session_token'];
        if (!cookie) {
            return res.status(400).json({ Error: "Not logged in" });
        }

        res.clearCookie("session_token", { path: "/" }); 
        return res.status(200).json({ Message: "Logged out successfully" });
    }
}