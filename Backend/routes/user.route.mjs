import express from "express"
let express = express.Router();
import userFields from "../models/user.model.mjs";
import controller from "../controller/user.controller.mjs"
import { body } from "express-validator";

express.post("/register", (req, res) => {
    body('email').isLength({ min: 4 }).withMessage("Starting letter should be atleast 4 letters");
    body('email').isLength().withMessage("Write you first email address");
    body('password').isLength({ min: 5 }).withMessage("make a strong password");
},
controller.userResister()
);

// express.post("/login", async (req, res) => {
//     try {
//         const user = await userFields.findOne({ email: req.body.email });
//         if (!user) {
//             return res.status(404).send({ message: "User not found" });
//         }
//         const isPasswordValid = await user.comparePassword(
//             req.body.password
//         );
//         if (!isPasswordValid) {
//             return res.status(401).send({ message: "Password is incorrect" });
//         } else {
//             res.status(200).send({ user });
//         }
//     } catch (error) {
//         res.status(500).send(error);
//     }
// });

export default express