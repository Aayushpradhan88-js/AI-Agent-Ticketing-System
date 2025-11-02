/*
AUTHENTICATION ALGORITHM

1. Spliting the req header authorized token spliting & taking 1st index
2. Decoding token through .verify(), taking header token and JWT_SECRET
3. If valid, attach user info to req.user

*/

import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apierrorUtils.js";
import { User } from "../v1/modules/user/userModel.js"
import { tokenSECRET } from "../constants/constant.js";

export const authenticateUser = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json(
            new ApiError(401, "Unauthorized, Token is missing")
        )
    }

    try {
        const decoded = jwt.verify(token, tokenSECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json(
            new ApiError(
                401,
                "Unauthorized, Invalid Token"
            )
        )
    }
}

const RBACMiddleware = async (req, res, next) => {
    const userId = await req.user_id
    const user = await User.role(userId)

}