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
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/user", router);
// app.use('/user', require('./routes/user.route.js'));

//Port
const PORT=3000;
app.listen(PORT, ()=>{
    console.log(`Server is running on PORT ${PORT}`);
} )

export default app;
