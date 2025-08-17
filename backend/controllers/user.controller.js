import { User } from "../models/user.models";
import { ApiResponse } from "../utils/ApiResponse.utils";
import { ApiError } from "../utils/ApiError.utils";


export const registerAccount = async (req, res) => {
    const { username, email, password, skills=[ ] } = req.body;

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
            password: hashedPassword
        });

        await user.save();

        const token = jwt.sign(
            { id: user._id, username: user.username },
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
                email: user.email
            }
        });

    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
}

export const loginAccount = async(req, res) => {
    const{emil, password} = req.body;
}