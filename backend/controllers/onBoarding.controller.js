import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.utils.js";

export const onBoardingController = async (req, res,) => {
    const userId = req.user._id;
    const { userType, answers } = req.body;

    try {
        let role;

        if(!userType){
            return res.status(400).json(
                ApiError(
                    400,
                    "userTyper is required!!!",
                    false
                )
            )
        }

        if (userType === 'student') {
            role = 'student'
        } else if (userType === 'moderator') {
            role = 'moderator'
        } else if (userType === 'admin') {
            role = 'admin'
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                role: userType,
                onBoardingCompleted: new Date(),
                onBoardingData: answers
            }, { new: true, runValidators: true }
        ).select('-password')

        if (!updatedUser) {
            return res.status(404).json(
                ApiError(
                    404,
                    "User not found"
                )
            );
        }

        return res.status(200).json({
            message: "onboarding completed successfully",
            user: updatedUser,
            success: true,
            redirectTo: "/tickets"
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json(
            ApiError(
                500,
                "INTERNAL SERVER ERROR, UNABLE TO UPDATE DATA IN DATABASE",
                error.message
            )
        )
    }
};