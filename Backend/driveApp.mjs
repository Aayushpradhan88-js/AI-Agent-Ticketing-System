import dotenv from "dotenv";
import cors from "cors";
import express from "express";


dotenv.config();
app.use(cors());
const app = express();

//imported files
import userSchema from "./models/user.model.mjs";
import userFilesSchema from "./models/files.model.mjs";
import router from "./routes/userApi.route.mjs";
import mongoDb from "./db/db.mjs";

userSchema();
userFilesSchema();
router;
mongoDb();

//middlewares
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/user", router);


//Port
const PORT=3000;
app.listen(PORT, ()=>{
    console.log(`Server is running on PORT ${PORT}`);
})

export default app;
