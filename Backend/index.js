import dotenv from "dotenv";
import cors from "cors";
import express from "express";

//imported files
import users from "./models/user.models.js";
import router from "./routes/route.routes.js";
import mongodb from "./db/db.js";

//call
dotenv.config();
const app = express();
app.use(cors());
users();
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
