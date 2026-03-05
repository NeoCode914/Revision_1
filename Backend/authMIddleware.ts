import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

declare global {
    namespace Express {
        export interface Request {
            userId: string
        }
    }
}


export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.token
    if (!token) {
        res.status(400).json({
            message: "please provide token"
        })
        return
    }
    const decoded = jwt.verify(`${token}`, `${process.env.JWT_SECRET}`) as JwtPayload
    if (!decoded) {
        res.status(400).json({
            message: 'token not valid'
        })
        return
    }
    req.userId = decoded.userId
    next()
}