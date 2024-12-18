import dotenv from "dotenv";
import cors from "cors";
import express from "express";

import mongoDb from "./db/userDB.mjs";
import userSchema from "./models/user.model.mjs";
import userFilesSchema from "./models/files.model.mjs";
import userRoutes from "./routes/userApi.route.mjs";
// import

const app = express();
dotenv.config();
app.use(cors());

// set up middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set up routes
app.get("/", (req, res) => {
    res.send("hello google-drive");
});

app.use("/api", userRoutes);
mongoDb();

export default app;
