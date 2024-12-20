import dotenv from "dotenv";
import cors from "cors";
import express from "express";

import mongoDb from "./db/userDB.mjs";
import userSchema from "./models/user.model.mjs";
import userFilesSchema from "./models/files.model.mjs";
import router from "./routes/userApi.route.mjs";


const app = express();
dotenv.config();
app.use(cors());
userSchema();
userFilesSchema();
router;
mongoDb();

// set up middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set up routes
// app.get("/profile", (req, res, next) => {
//     console.log("Middleware hit");  
// });

app.use("/user", router);

export default app;
