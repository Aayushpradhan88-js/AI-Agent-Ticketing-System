import { User } from "../user/userModel.js"
import { ApiError } from "../../../utils/apierrorUtils.js";

export const onboardingController = async (req, res) => {

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

    if (!userType) {
        return res.status(400).json(
            ApiError(
                400,
                "userType is required!!!",
                false
            )
        )
    }

    try {
        const validRoles = ['student', 'moderator', 'admin']
        if (!validRoles.includes(userType)) {
            return res.status(402).json(
                ApiError(
                    402,
                    "invalid usertyper!!"
                )
            )
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                role: userType,
                onBoardingData: answers,
                onBoardingCompleted: true,  // ✅ Set to true
                onBoardingCompletedAt: new Date()  // ✅ Fixed typo
            },
            { new: true, runValidators: true }
        ).select('-password')

        if (!updatedUser) {
            return res.status(404).json(
                ApiError(
                    404,
                    "User not found"
                )
            );
        };

        return res.status(200).json({
            success: true,
            user: updatedUser,
            redirectTo: "/tickets",
            message: "onboarding completed successfully"
        });

    } catch (error) {
        console.error(error.stack);
        return res.status(500).json(
            ApiError(
                500,
                "internal server error, unable to update data in database",
                console.error(error.stack)
            )
        )
    }
};

//----------CHECK ONBOARDING STATUS----------//
export const onboardingStatus = (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json(

                ApiError(
                    401,
                    "user is not it the request!!!",
                ))
        }

        return res.status(200).json({
            // success: true,
            // hasOnboardingCompleted: user.onBoardingCompleted,
            // userType: user.userType,
            // message: "Onboarding status is successfully completed"
           
                success: true,
                hasOnboardingCompleted: user.onBoardingCompleted,  // ✅ Correct field name
                userType: user.role,  // ✅ Changed from user.userType to user.role
                message: "Onboarding status retrieved successfully"
        })
    } catch (error) {
        console.error(error.stack)
        return res.status(500).json(
            ApiError(
                500,
                "server error, not able to check onboarding status"
            )
        )
    }
}