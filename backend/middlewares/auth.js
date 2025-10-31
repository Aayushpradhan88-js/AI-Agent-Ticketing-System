/*
AUTHENTICATION ALGORITHM

1. Spliting the req header authorized token spliting & taking 1st index
2. Decoding token through .verify(), taking header token and JWT_SECRET
3. If valid, attach user info to req.user

*/

import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.utils.js";
import { User } from "../models/user.models.js";

const authenticateUser = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res
            .status(401)
            .json(
                new ApiError(
                    401,
                    "Unauthorized, Token is missing"
                )
            )
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res
            .status(401)
            .json(
                new ApiError(
                    401,
                    "Unauthorized, Invalid Token"
                )
            )
    }
}

export default authenticateUser