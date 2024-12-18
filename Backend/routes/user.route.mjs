import express from "express";
import { body } from "express-validator";

const router = express.Router();

router.post("/register", [
    body("email").isLength({ min: 4 }).withMessage("Email must be at least 4 characters"),
    body("password").isLength({ min: 5 }).withMessage("Password must be at least 5 characters"),
], (req, res) => {
    res.json({ message: "Validation passed", data: req.body });
});



export default router;
