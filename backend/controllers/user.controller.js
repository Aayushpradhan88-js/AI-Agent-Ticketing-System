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
                    role: user.role,
                    skills: user.skills
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
        
        const isMatch = bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
            { _id: user._id, role: user.role, user: user.username },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_TOKEN_EXPIRY_DATE || '24h' }
        );

        res
            .status(200)
            .json(
                {
                    message: "User LoggedIn Successfully",
                    token,
                    user
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
                .status(403)
                .json(
                    new ApiError(403, "YOU'RE NOT ADMIN OF THIS ACCOUNT, try again")
                );
        }

        const users = await User.find().select("-password");
        if (!users || users.length === 0) {
            return res
                .status(404)
                .json(
                    new ApiError(404, "USERS ARE NOT FOUND")
                );
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    "Users fetched successfully",
                    users
                )
            );
    } catch (error) {
        console.error("Failed to find users:", error);

        return res
            .status(500)
            .json(
                new ApiError(500, "INTERNAL SERVER ERROR, FAILED TO FIND USERS")
            );
    }
};

//----------ADMIN UPDATE USER----------//
export const adminUpdateUser = async (req, res) => {
    const { userId } = req.params;
    const { username, email, skills, role, location, bio, status } = req.body;

    // 1.Check if user is admin
    // 2.Find target user
    // 3.Check if trying to modify another admin (prevent admin lockout)
    // 4.Prepare update object
    try {
        if (req.user.role !== "admin") {
            return res
                .status(403)
                .json(
                    new ApiError(403, "Access denied. Admin privileges required.")
                );
        }

        const targetUser = await User.findById(userId);
        if (!targetUser) {
            return res
                .status(404)
                .json(
                    new ApiError(404, "User not found")
                );
        }

        if (targetUser.role === "admin" && targetUser._id.toString() !== req.user._id.toString()) {
            return res
                .status(403)
                .json(
                    new ApiError(403, "Cannot modify other admin accounts")
                );
        }

        const updateData = {};
        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (skills) updateData.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
        if (role) updateData.role = role;
        if (location) updateData.location = location;
        if (bio) updateData.bio = bio;
        if (status) updateData.status = status;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            {
                new: true,
                select: "-password"
            }
        );

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    "User updated successfully by admin",
                    updatedUser
                )
            );
    } catch (error) {
        console.error("Failed to update user as admin:", error);

        return res
            .status(500)
            .json(
                new ApiError(
                    500,
                    "INTERNAL SERVER ERROR, FAILED TO UPDATE USER"
                )
            );
    }
};

//----------ADMIN DELETE USER----------//
export const adminDeleteUser = async (req, res) => {
    const { userId } = req.params;

    // 1.Check if user is admin
    // 2.Find target user
    // 3.Prevent admin from deleting themselves
    // 4.Prevent deleting other admins
    try {
        if (req.user.role !== "admin") {
            return res
                .status(403)
                .json(
                    new ApiError(403, "ACCESS IS DENIED.  ADMIN IS REQUIRED")
                );
        }

        const targetUser = await User.findById(userId);
        if (!targetUser) {
            return res
                .status(404)
                .json(
                    new ApiError(404, "USER NOT FOUND!!")
                );
        }
        //---UN-NECESSARY FEATURE----//
        if (targetUser._id.toString() === req.user._id.toString()) {
            return res
                .status(403)
                .json(
                    new ApiError(403, "CANNOT DELETE OWN ACCOUNT")
                );
        }

        if (targetUser.role === "admin") {
            return res
                .status(403)
                .json(
                    new ApiError(403, "Cannot delete admin accounts")
                );
        }

        await User.findByIdAndDelete(userId);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    "User deleted successfully",
                    { deletedUserId: userId }
                )
            );
    } catch (error) {
        console.error("Failed to delete user:", error);

        return res
            .status(500)
            .json(
                new ApiError(
                    500,
                    "INTERNAL SERVER ERROR, FAILED TO DELETE USER"
                )
            );
    }
};

//----------ADMIN TOGGLE USER STATUS----------//
export const adminToggleUserStatus = async (req, res) => {
    const { userId } = req.params;
    const { status } = req.body; // 'active' or 'inactive'

    try {
        if (req.user.role !== "admin") {
            return res
                .status(403)
                .json(
                    new ApiError(403, "Access denied. Admin privileges required.")
                );
        }

        const targetUser = await User.findById(userId);
        if (!targetUser) {
            return res
                .status(404)
                .json(
                    new ApiError(404, "User not found")
                );
        }

        // Prevent admin from deactivating themselves
        if (targetUser._id.toString() === req.user._id.toString()) {
            return res
                .status(403)
                .json(
                    new ApiError(403, "Cannot change your own status")
                );
        }

        // Prevent deactivating other admins
        if (targetUser.role === "admin" && status === "inactive") {
            return res
                .status(403)
                .json(
                    new ApiError(403, "Cannot deactivate admin accounts")
                );
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { status: status || (targetUser.status === 'active' ? 'inactive' : 'active') },
            {
                new: true,
                select: "-password"
            }
        );

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    `User status updated to ${updatedUser.status}`,
                    updatedUser
                )
            );
    } catch (error) {
        console.error("Failed to toggle user status:", error);

        return res
            .status(500)
            .json(
                new ApiError(
                    500,
                    "INTERNAL SERVER ERROR, FAILED TO UPDATE USER STATUS"
                )
            );
    }
};
