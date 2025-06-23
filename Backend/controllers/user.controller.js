import {User} from '../models/user.models.js';

import { ApiResponse } from '../utils/ApiResponse.js';
import {ApiError} from '../utils/ApiError.js'

const signUpUser = async(req, res) => {
    const {username, fullname, email, password} = req.body;

    if(
        [username, fullname, email, password].some((field) => field?.trim() === '')   
    ){
        throw new ApiError(401, "ALL FIELDS ARE REQUIRED!!!")
    };

    const isExisted = await User.find({
        $or: [{username}, {email}]
    });

    if(isExisted) throw new ApiError(402,"USERNAME OR EMAIL IS ALREADY TAKEN");

    const user = await User({
        username,
        fullname,
        email,
        password
    })

    if(!user) throw new ApiError(500, "SERVER OR DATABASE INTERNAL ERROR");

    


}

const signInUser = async(req, res) => {

}

const logoutUser = async(req, res) =>{

}


export {
    signUpUser,
    signInUser,
    logoutUser
};