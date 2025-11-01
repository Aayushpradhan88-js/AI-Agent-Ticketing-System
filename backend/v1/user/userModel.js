import mongoose from "mongoose"

const userModel = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
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
        required: function () {
            return !this.googleId; //--password not required if Google OAuth user
        },
        lowercase: true,
        minlength: [5, "minimum 5 letter is required"],
        trim: true
    },
    googleId: {
        type: String,
        sparse: true //-----Allow multiple null values but ensure uniqueness for non-null values-----//
    },
    bio: {
        type: String,
        trim: true,
        maxlength: [500, "Bio limit 500 characters"]
    },
    skills: {
        type: [String], //-----Change to array of strings-----//
        default: [],
        trim: true,
    },
    role: {
        type: String,
        enum: ["student", "admin", "moderator"],
        default: "student"
    },
    location: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },
    onBoardingData: {
        userType: String,
        source: String,
        experience: String,
        goals: [String],
        interests: [String],
        work: String,
        timeSpan: String
    },
    onBoardingCompleted: {
        type: String,
        boolean: false
    },
},
    {
        timestamps: true
    }
);

export const User = mongoose.model("User", userModel);