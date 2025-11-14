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

        if(!email || !password) {
            return  res.status(400).json({ Error: "Email and password are required" });
        }

        const exists = await userModel.exists({email: email});
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

        return res.status(200).json({ Message: "Logged in successfully"});
    },

    signup: async (req: Request, res: Response) => { 
        const missingFields = await userModel.validateRequiredFields(req.body);
        const invalidFields = await userModel.validateFields(req.body);

        if (invalidFields.length > 0 || missingFields.length > 0) {
            return res.status(400).json({Error: "Invalid or missing fields"})
        }
        const exists = await userModel.exists({ email: req.body.email });
        if (exists) {
            return res.status(409).json({Error: "Email already in use"});
        }

        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const user = {
                ...req.body, password: hashedPassword
            };

            const query = await userModel.create(user);

            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET as string, { expiresIn: '24h' });
            res.cookie("session_token", token, { httpOnly: true, secure: false, sameSite: "lax", maxAge: 60 * 60 * 24000 });

            return res.status(201).json({ Message: "User created successfully", UserID: query.insertId });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ Error: "Internal server error" });
        }
    }
}