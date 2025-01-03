import express from 'express';

//installation
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import cookie from 'cookie-parser'

const router = express.Router();


//imported file
import User from '../models/user.model.mjs';

//register route
router.get('/register', (req, res) => {
    res.render('register');
})

router.post('/register',
    body('username').trim().isLength(5, 'Write at least 5 characters'),
    body('email').trim().isLength(13).isEmail(),
    body('password').trim().isLength(6, 'Make strong password'),

    async (req, res) => {
        const err = validationResult(req);

        if (!err.isEmpty()) {
            return res.status(400).json({
                err: err.array(),
                message: "Please fill all the input fields"
            })
        }

        const { username, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword
        })

        res.json(user);
    });

//login route
router.get('/login', (req, res) => {
    res.render('login');
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    //checking the email
    if (!user) {
        return res.status(401).json({
            message: "Cannot find email & password"
        })
    }

    const isMatch = await bcrypt.compare(password, user.password);
    //checking the password
    if (!isMatch) {
        return res.status(401).json({
            message: "Cannot find email & password"
        })
    }

    //sending cookie to frontend
    res.cookie('user', user._id);

    res.json({
        message: "Successfully loggedin",
        user: user
    })
})
export default router;