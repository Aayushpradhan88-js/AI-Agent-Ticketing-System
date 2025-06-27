import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true
    },

    fullname: {
        type: String,
        required: [true, "Full name is required"],
        minlength: [3, "Full name must be at least 3 characters long"]
    },

    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, "Email must be at least 5 characters long"]
    },
    password: {
        type: String,
        required: true,
        minlength: [5, "Password must be at least 6 characters long"]
    },

    // avatar: {
    //     type: String,
    //     required: true
    // },
    
    accessToken: {
        type: String,
    }
}, {timestamps: true});


//----------HASHING PASSWORD----------//
userSchema.pre("save",  async function(next ){
    if(!this.isModified('password')) next();

    this.password = await bcrypt.hash(this.password, 10);

    next();
}); 

//----------VERIFYING PASSWORD----------//
userSchema.methods.isPasswordCorrect = async(password) => {
    return await bcrypt.compare(this.password, password);
};

//----------GENERATE ACCESS-TOKEN----------//  
userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            fullname: this.fullname,
            email: this.email
        }, 
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
};

//----------GENERATE REFRESH-TOKEN----------//  
userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema);