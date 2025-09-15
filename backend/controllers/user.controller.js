// import dotenv from "dotenv"
// dotenv.config()
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { inngest } from "../inngest/client.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//---------REGISTER ACCOUNT----------//
export const registerAccount = async (req, res) => {
    const { username, email, password, skills = [] } = req.body;

    try {
        if (!username || !email || !password || !skills) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already taken' });
        }
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password: hashedPassword,
            skills
        });

        await user.save();

        //FIRE INNGEST
        await inngest.send(
            {
                name: 'user/signup',
                data: {
                    email
                }
            }
        )

        const token = jwt.sign(
            { _id: user._id, role: user.role, user: user.username },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_TOKEN_EXPIRY_DATE }
        );
        console.log(process.env.JWT_SECRET);
        console.log(user)
        res
            .status(201)
            .json({
                message: 'User registered successfully',
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.skills
                }
            });

    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
}

//---------LOGIN ACCOUNT----------//
export const loginAccount = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
            { _id: user._id, role: user.role, user: user.username },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_TOKEN_EXPIRY_DATE || '24h' }
        );

        res.json(
            {
                user,
                token
            }
        );
    } catch (error) {
        res.status(500).json({ error: "Login failed", details: error.message });
    }
}

//---------LOGOUT ACCOUNT----------//
export const logoutAccount = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No token provided" });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decodedToken?._id).select("-password");

        if (!user) {
            return res.status(401).json({ message: "Invalid Access Token" });
        }

        // For JWT-based logout, we just send success response
        // Client should remove token from storage
        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });

    } catch (error) {
        console.error('Logout Error:', error);
        res.status(500).json({
            success: false,
            message: "Server error during logout"
        });
    }
}

//---------UPDATING ACCOUNT----------//
export const updateAccount = async (req, res) => {
    const { username, email, skills, role, location, bio } = req.body;

    try {
        const userId = req.user?._id || req.user?.id;
        if (!userId) {
            return res
                .status(401)
                .json(
                    new ApiError(401, "Unauthorized - Invalid token")
                );
        }

        // Find user by ID from token (more secure than email from body)
        const user = await User.findById(userId);
        if (!user) {
            return res
                .status(404)
                .json(
                    new ApiError(404, "User not found")
                );
        }

        // Prepare update object - only update provided fields
        const updateData = {};
        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (skills) updateData.skills = skills;
        if (location) updateData.location = location;
        if (bio) updateData.bio = bio;

        // Only admins can update role
        if (role && req.user?.role === "admin") {
            updateData.role = role;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            {
                new: true,
                select: "-password"
            }
        );

        console.log("updated user ", updatedUser);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    "User updated successfully",
                    updatedUser
                )
            );
    }
    catch (error) {
        console.error("Failed to update user:", error);

        res
            .status(500)
            .json(
                new ApiError(
                    500,
                    "INTERNAL SERVER ERROR, FAILED TO UPDATE USER"
                )
            );
    };
};

//----------GETTING ALL USER ACCOUNT----------//
export const getAllAccountUsers = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            console.log("account should not be admin");
            return res
                .status(402)
                .json(
                    new ApiError(403, "YOU'RE NOT ADMIN OF THIS ACCOUNT, try again")
                )
        };

        const users = await User.find().select("-password");
        if (!users || users.length === 0) {
            return res
                .status(404)
                .json(
                    new ApiError(404, "USERS ARE NOT FOUND")
                )
        };
        return res
            .status(200)
            .json(
                new ApiResponse(200, "Users fetched Successfully", users)
            )
    } catch (error) {
        console.log("Failed to find users");

        return res
            .status(500)
            .json(
                new ApiError(500, "INTERNAL SERVER ERROR, FAILED TO FIND USERS")
            );
    }
};

//----------ADMIN UPDATE USER----------//
export const adminUpdateAccount = async (req, res) => {
    const {userId} = req.params;
    const {username, email, bio, skills, location} = req.body;

    try{
        if(req.user.role != "admin") {
            return res
            .status(403)
            .json(
                new ApiError(403, "ACCESS DENIED, YOU'RE NOT ADMIN")
            )
        };

        const targetedUser = await User.findById(userId);
        if(!targetedUser) {
            return res
            .status(404)
            .json(
                new ApiError(404, "USER NOT FOUND!!")
            );
        };

        if(targetedUser.role === "admin" && targetedUser._id.toString() != req.user._id.toString()){
            return res
            .status(403)
            .json(
                new ApiError(403, "CANNOT MODIFY OTHER ADMIN ACCOUNTS")
            )
        };

        const updatedData = {};
        if(username) updatedData.username = username;
        if(email) updatedData.email = email;
        if(skills) updatedData.skills = skills;
        if(bio) updatedData.bio = bio;
        if(location) updatedData.location = location;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updatedData,
            {
                new: true,
                select: "-password"
            }
        )
    } catch(error) {
        console.log(error.messsage)
    }
}

