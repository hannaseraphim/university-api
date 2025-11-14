import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies['session_token'];
    if (!token) {
        return res.status(401).json({ Error: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        (req as any).user = decoded;
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({ Error: "Invalid token provided" });
    }
};