"strict mode";
import dotenv from "dotenv";
import cors from "cors";
import express from "express";

import mongodb from "./db/userDB.mjs";
import userModel from "./models/user.model.mjs"
import router from "./routes/userApi.route.mjs"
import userFiles from "./models/files.model.mjs";
// import

const app = express();
dotenv.config();
app.use(cors());
userModel();
userFiles();
// router();
mongodb();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use("/api", router);

export default app;