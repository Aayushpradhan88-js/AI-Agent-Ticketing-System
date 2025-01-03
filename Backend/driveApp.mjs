import dotenv from "dotenv";
import cors from "cors";
import express from "express";

//call-1
dotenv.config();
const app = express();
app.use(cors());

//imported files
import userSchema from "./models/user.model.mjs";
import router from "./routes/auth.mjs";
import mongodb from "./db/db.mjs";

//call-2
userSchema();
router;

//middlewares
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//router
app.use("/user", router);
mongodb();

//Port
const PORT=3000;
app.listen(PORT, ()=>{
    console.log(`Server is running on PORT ${PORT}`);
})

export default app;
