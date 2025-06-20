import express from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import cookie from 'cookie-parser'
const router = express.Router();

//imported file
import users from '../models/user.models.js';



//register route
router.get('/register', (req, res) => {
    res.render('register');
})

router.post('/register',
    body('username').trim().isLength(5, 'username at least 5 letters!!'),
    body('email').trim().isLength(13).isEmail(),
    body('password').trim().isLength(6, 'Make strong password'),

    async (req, res) => {

        //checking the user fields
        const err = validationResult(req);

        if (!err.isEmpty()) {
            return res.status(400).json({
                err: err.array(),
                message: "Please fill all the input fields"
            })
        }

        //securing the user password......
        const { username, email, password } = req.body;
        const genSalt = 10;
        const hashedPassword = await bcrypt.hash(password, genSalt);
        const user = await users.create({
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

    //finding the email from the db 
    const { email, password } = req.body; //destructuring the login form
    const userEmailMatch = await users.findOne({ email }); //finding email

    //checking the email
    if (!userEmailMatch) {
        return res.status(401).json({
            message: "Cannot find email"
        })
    }

    const userPasswordMatch = await bcrypt.compare(password, users.password);
    //checking the password
    if (!userPasswordMatch) {
        return res.status(401).json({
            message: "Cannot find password"
        })
    }

    //sending cookie to frontend
    res.cookie('users', users._id);

    res.json({
        message: "Successfully loggedin",
        users: users
    })
})

//home
router.get('/home', (req, res) => {
    res.render('home');
})

router.post('/home', (req, res) => {
    res.redirect('/user/login');

})
export default router;