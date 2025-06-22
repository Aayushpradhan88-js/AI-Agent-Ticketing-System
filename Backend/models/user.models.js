import mongoose from "mongoose";

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

    profilePicture: {
        type: String,
        default: "https://example.com/default-profile-picture.png" // Placeholder URL for default profile picture
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
        minlength: [6, "Password must be at least 6 characters long"]
    },
});

//EXPORTING
const User = mongoose.model("User", userSchema);
export default users;