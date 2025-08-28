import mongoose from "mongoose"

const userModel = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        lowercase: true,
        minlength: [3, "minimum 3 letter is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    },
    password: {
        type: String,
        required: true,
        lowercase: true,
        minlength: [5, "minimum 5 letter is required"],
        trim: true
    },
    skills: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        enum: ["user", "admin", "moderator"],
        default: "user"
    }
}, {
    timestamps: true
});

export const User = mongoose.model("User", userModel);