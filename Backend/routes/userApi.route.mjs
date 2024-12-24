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
        cb(null, `${Date.now()}-${file.originalname}`)
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

    const newUser = new userModel({ email, password });
    await newUser.save();
    res.status(201).json({
        message: "User registered successfully"
    })
})

//User logging code
router.post('/login', async (req, res) => {
    const { email, password } = req.body; // Destructuring the html data
    const user = await userModel.findOne({ email });

    if (!user || (await userModel.comparepassword(password))) { //It check the user email or password is valid or not
        return res.status(401).json({ message: "Invalid data" }); //401-unauthorized user
    }

    //If the user is valid then below code will run which is to response the token for user.
    const token = jwt.sign({ _id: userModel.id }, process.env.JWT_SIGN, { expiresIn: '1h' })
    //expiresIn: '1h' -- The token will expire with in 1hour from the user device
    res.status(200).json({ message: "User is logged in", token });
})

router.post('/upload', upload.single('file'), async (req, res) => {
    const { userID } = req.body;
    const newFile = new userFiles({
        userID,
        fileName: req.file.originalname,
        filePath: req.file.path
    })

    await newFile.save();
    res.status(200).json({ message: "File uploaded successfully", fileName: newFile });
})




export default router;