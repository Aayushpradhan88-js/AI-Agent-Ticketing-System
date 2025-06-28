import express from 'express';
import {
    signInUser,
    signUpUser
} from "../controllers/user.controller.js"
const router = express.Router();


router.post('/signup',signUpUser );

router.get('/login', signInUser)


export {router};