import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.utils.js";

export const onBoardingController = async (req, res,) => {

    /*
    Algorithm
    1. first we extract the userid from the request of client
    2. Then we extract userType and answers fromt he request
    3. applied try catch block: catch block - writing error if user makes error & try block - In try i have validate user with each portion and update user saved in database
    4. Try block destructuring and defining the types:
       -- 4a. data we have (role, userType{stu., mod., adm.}, answers)
       -- 4b. 1st we validate the frontend request 
              -- 4b1. Is user Type is comming is not ApiError will passed with 400 status
              -- 4b2. Check the type of useType is it stu., mod., adm.
              -- 4c3. Update User - It require to call db where we over-write the data 
                                  - for updation we make '{ }' & put role, onBoardingData, onBoardingStatus
                                  - 

    */
    const userId = req.user._id;
    const { userType, answers } = req.body;

    try {
        let role;

        if (!userType) {
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
                onBoardingData: answers,
                onBoardingCompleted: new Date()
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

//----------CHECK ONBOARDING STATUS----------//
export const checkOnboardingStatus = (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json(ApiError(
                401,
                "USER IS NOT IN THE REQUEST!!",
            ))
        }

        return res.status(200).json({
            success: true,
            hasOnboardingCompleted: user.onBoardingCompleted,
            userType: user.userType,
            message: "Onboarding status is successfully completed"
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json(
            ApiError(
                500,
                "SERVER ERROR. NOT ABLE TO CHECK ONBOARDING STATUS"
            )
        )
    }
}