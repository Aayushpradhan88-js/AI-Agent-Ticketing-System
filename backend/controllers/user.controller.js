import { User } from "../models/user.models";
import { ApiResponse } from "../utils/ApiResponse.utils";
import { ApiError } from "../utils/ApiError.utils";
import { inngest } from "../inngest/client";

//---------REGISTER ACCOUNT----------
export const registerAccount = async (req, res) => {
    const { username, email, password, skills = [] } = req.body;

    try {
        if (!username || !email || !password || !skills) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            throw new ApiError.status(400).json({ message: 'Username already taken' });
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
            { id: user._id, user: user.username, user: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

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

//---------LOGIN ACCOUNT----------
export const loginAccount = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = User.findOne({ email });
        if (!user) return res.status(401).json({ error: "User not found" });

        const isMatch = await brcypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.JWT_SECRET
        );

        res.json({ user, token });
    } catch (error) {
        res.status(500).json({ error: "Login failed", details: error.message });
    }
}

//---------LOGOUT ACCOUNT----------
export const logoutAccount = async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) throw new ApiError(401, "Unauthorized")

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decodedToken?._id).select("-password")
    if (!user) throw new ApiError(401, "Invalid Access Token")

    req.user = user;

}

//---------UPDATING ACCOUNT----------
export const updateAccount = async (req, res) => {
    const { username, email, skills = [], role } = req.body;

    try {
        if (req.user?.role !== "admin") {
            return res
                .status(401)
                .json(
                    new ApiError(400, "Unauthorized")
                );
        };

        const user = await User.findOne({ email });
        if (!user) return res
            .status(403)
            .json(
                new ApiError(404, "user not found")
            );

        const updateAcc = await User.updateOne(
            { email },
            {
                skills: skills.length ? skills : user.skills,
                role,
                username
            }
        );

        return res
            .status(200)
            .json(
                new ApiResponse(200, "User updated successfully", updateAcc)
            );
    }
    catch (error) {
        console.log("Failed to update user");

        res
            .status(500)
            .json(
                new ApiError(500, "INTERNAL SERVER ERROR, FAILED TO UPDATE USER")
            );
    };
};

//----------GETTING ALL USER ACCOUNT----------
export const getAllAccountUsers = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            console.log("account should not be admin");
            res
                .status(402)
                .json(
                    new ApiError("YOU'RE NOT ADMIN OF THIS ACCOUNT, try again")
                )
        };

        const users = await User.find().select("-password");
        if (!users) {
            res
                .status(404)
                .json(
                    new ApiError("USERS ARE NOT FOUND")
                )
        };

        res.send(users);
    } catch (error) {
        console.log("Failed to find users");

        res
            .status(500)
            .json(
                new ApiError(500, "INTERNAL SERVER ERROR, FAILED TO FIND USERS")
            );
    }
}