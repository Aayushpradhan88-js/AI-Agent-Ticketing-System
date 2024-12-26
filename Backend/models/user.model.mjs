"strict mode";

import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userFields = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    }
})

userFields.pre("save", async function (next) {
    if(this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})

userFields.method("comparePassword", async function (password) {
    if (!password || !this.password) {
        throw new Error("Password is required");
    }
    return await bcrypt.compare(password, this.password);
})

const userModel = mongoose.model("User", userFields);
export default userModel;
