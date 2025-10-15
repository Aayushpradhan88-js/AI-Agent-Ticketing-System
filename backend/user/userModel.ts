import mongoose, { Schema, Document, model } from "mongoose"

export interface IUser extends Document {
    username: string
    email: string
    password?: string
    googleId?: string
    skills: string[]
    role: "user" | "admin" | "moderator";
    
}