import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";

const onboardingMiddleware = async (req, res) => {
    try {
        const user = await User.findById(req.user)

        //-----Check is user authenticated-----//
        if (!user) {
            return res.status(401).json(
                ApiError(
                    401,
                    "user is not authenticated",
                )
            )
        }

        //-----Check onBoarding status-----//
        if (!user.onBoardingCompleted) {
            return res.status(402).json(
                ApiResponse(
                    false,
                    "failed ot complete onboarding",
                    {
                        next: "/onBoarding"
                    }
                )
            )
        }

        req.user = user;

        return next();
    } catch (error) {
        console.error(error.stack)
        return res.status(500).json(
            ApiError(
                500,
                "server error!!"
            )
        )
    }
};

export default onboardingMiddleware;