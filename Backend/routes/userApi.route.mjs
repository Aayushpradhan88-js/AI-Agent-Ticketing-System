import express from 'express'
import multer from 'multer'
import userModel from '../models/user.model.mjs'
import userFiles from '../models/files.model.mjs'
import jwt from 'jsonwebtoken';

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cd(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({ storage: storage })

//Routes
//User Registration Logic
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const existingUser = await userModel.find({ email });
    if (!existingUser) {
        return res.status(400).json({ message: "Email already exist" });
    }

    const newUser = new User({ email, password });
    await newUser.save();
    res.status(201).json({
        message: "User registered successfully"
    })
})

export default router