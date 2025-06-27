import dotenv from "dotenv";
import cors from "cors";
import express from "express";

import {router as userRouter} from "./routes/route.routes.js";
import {dbConnection} from "./db/db.js";

dotenv.config();
const app = express()
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/v1/user", userRouter);
 console.log("running main file")
      console.log(process.env.MONGO_URL)
dbConnection()

//Port
const PORT= process.env.PORT 
app.listen(PORT, ()=>{
    console.log(`Server is running on PORT ${PORT}`);
})