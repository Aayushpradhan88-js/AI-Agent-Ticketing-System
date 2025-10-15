import type { Request, Response } from "express";

interface IUser {
    username: string, 
    email: string,
    password?: string
}

export const registerAccount = async(req:Request, res:Response) => {
    const{username, email, password, skills} = req.body;

    if(!username || !email || !password) {
        return res.json({
            message: "All fields are required"
        });

        const existingUsername = await 
    }
}