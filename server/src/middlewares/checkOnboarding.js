import { User } from "../v1/modules/user/userModel.js"
import { ApiError } from "../utils/apierrorUtils.js";
import { ApiResponse } from "../utils/apiresponseUtils.js";

export const onboarding = async (req, res, next) => {
    
    try {
        if (!req.user || (!req.user._id && !req.user.id)) {
            return res.status(403).json(
                new ApiError(403, "You're not authorized")
            )
        }

        const userId = req.user._id || req.user.id;
        const user = await User.findById(userId).select("-password");
        // const onboarding = aw
        console.log("user", user._id)
        //-----Check is user authenticated-----//
        if (!user) {
            return res.status(401).json(
                new ApiError(
                    401,
                    "user is not authenticated",
                )
            )
        }

        //-----Check onBoarding status-----//
        if (!user.onboardingCompleted) {
            return res.status(403).json(
                new ApiResponse(
                    403,
                    "failed to complete onboarding",
                    {
                        next: "/onboarding"
                    }
                )
            )
        }

        req.user = user;

        return next();
    } catch (error) {
        console.error("onboarding middleware",error.stack)
        return res.status(500).json(
            new ApiError(
                500,
                "server error!!"
            )
        )
    }
};