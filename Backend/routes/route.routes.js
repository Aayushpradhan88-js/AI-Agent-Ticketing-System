import express from 'express';
import {
    signUpUser
} from "../controllers/user.controller.js"
const router = express.Router();


router.post('/signup',signUpUser );

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
export {router};