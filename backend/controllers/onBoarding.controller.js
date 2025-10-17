import { User } from "../models/user.models";

export const onBoarding = async (req, res, next) => {
    const { userType, experience, interest, goals } = req.body;

    try {
        let role;

        if (userType === 'student') {
            role = 'student'
            console.log("student onboarding")
        } else if (userType === 'moderator') {
            role = 'moderator'
            console.log("moderator onboarding")
        } else if (userType === 'admin') {
            role = 'admin'
            console.log("admin onboarding");
        }

        const user = await User.findById(
            req.user._id,
            {
                role,
                onBoardingCompleted: true,
                onBoardingData: {
                    experience,
                    goals,
                    interest,
                }
            }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res
        .status(200)
        .json(
            {
                message: "onboarding completed successfully",
                user
            }
        )

    } catch (error) {
        console.log(error.message)
    }
}