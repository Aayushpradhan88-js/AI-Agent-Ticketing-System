import { User } from "../v1/modules/user/userModel.js"
import { ApiError } from "../utils/apierrorUtils.js";
import { ApiResponse } from "../utils/apiresponseUtils.js";

export const onboarding = async (req, res, next) => {
    const user = await User.findById(req.user._id);

    try {
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
            return res.status(403).json(
                ApiResponse(
                    false,
                    "failed to complete onboarding",
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