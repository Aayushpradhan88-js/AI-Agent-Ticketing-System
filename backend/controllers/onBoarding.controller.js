import { User } from "../models/user.models";

export const onBoarding = async (req, res, next) =>{
    const {userType, experience, interest, goals} = req.body;

    try {
        let role;
        if(userType === 'student'){
            role = "student"
        }
    } catch (error) {
        console.log(error.message)
    }
}