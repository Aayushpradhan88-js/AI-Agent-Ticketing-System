import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import cors from "cors";
app.use(cors());
import mongodb from "./db/userDB.mjs";

mongodb();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export default app;