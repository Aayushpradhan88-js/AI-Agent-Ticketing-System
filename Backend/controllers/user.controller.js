import {User} from '../models/user.models.js';

import { ApiResponse } from '../utils/ApiResponse.js';
import {ApiError} from '../utils/ApiError.js'

const generateAccessTokenAndRefreshToken = async(userId) => {

    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
    
        user.refreshToken = refreshToken;
        await user.save({validataBeforeSave: false})
    
        return {accessToken, refreshToken};
    } 
    
    catch (error) {
        throw new ApiError(500, "UNABLE TO GENERATE ACCESS & REFRESH TOKEN");
    };

}


const signUpUser = async(req, res) => {
    const {username, fullname, email, password} = req.body;
    console.log(username) 
    console.log("running")
     console.log(process.env.MONGO_URL)
    if(
        [username, fullname, email, password].some((field) => field?.trim() === '')   
    ){
        throw new ApiError(401, "ALL FIELDS ARE REQUIRED!!!")
    };

    const isExisted = await User.find({
        $or: [{username}, {email}]
    });

    if(!isExisted) throw new ApiError(401, "USERNAME OR EMAIL IS ALREADY TAKEN");

    const user = await User.create({
        username,
        fullname,
        email,
        password
    })

    console.log(user);
    console.log("running")

    if(!user) throw new ApiError(500, "SERVER OR DATABASE INTERNAL ERROR");

    //  const {accessToken, refreshToken} = await generateAccessTokenAndRefreshToken(user._id);
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    
        return res
        .status(201)
        .json(
            new ApiResponse(
                200, 
                createdUser, 
                "User registered Successfully"
            )
    )
    
}

const signInUser = async(req, res) => {
    const {email, password} = req.body;

    if(
        [email, password].some((fields) => fields?.trim() === 'undefined') 
    ) {
        throw new ApiError(401, "ALL FIELDS ARE REQUIRED");
    };
}

const logoutUser = async(req, res) =>{

}


export {
    signUpUser,
    signInUser,
    logoutUser
};