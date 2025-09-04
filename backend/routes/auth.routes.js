import express from "express";
import passport from "passport";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { ApiError } from "../utils/ApiError.utils.js";
import {
    registerAccount,
    loginAccount,
    logoutAccount,
    updateAccount,
    getAllAccountUsers
} from "../controllers/user.controller.js";

import { authenticate } from "../middlewares/auth.js";
import { ApiError } from "../utils/ApiError.utils.js";

export const authRoute = express.Router();

authRoute.post("/register", registerAccount);
authRoute.post("/login", loginAccount);
authRoute.post("/logout", logoutAccount);

authRoute.post("/update-account", authenticate, updateAccount);
authRoute.get("/get-users-account", authenticate, getAllAccountUsers);

//----------GOOGLE OAUTH----------//
authRoute.get("/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}));

authRoute.get("/google/callback", passport.authenticate("google", {
    failureRedirect: "/login?error=oauth_failed"
}),

    (_, res) => {
        const redirectUrl = process.env.CLIENT_URL
        res.redirect(`${redirectUrl}/tickets?auth=success`);
    });

authRoute.get("/me", (req, res) => {
    //-----Session-Based Authentication-----//
    if (req.user) {
        res.json(
            {
                success: true,
                user: req.user,
                authType: "session"
            }
        )
    } else {
        //-----JWT Authentication-----//
        const token = req.headers.authorization?.split(" ")[1]
        if (token) {
            const decode = jwt.verify(token, process.env.JWT_SECRET)

            res.json(
                {
                    success: true,
                    user: decode,
                    authType: "jwt"
                }
            )
        } else {
            res
            throw new ApiError(403, "NOT AUTHENTICATED");
        }
    }
})

auth.post("/logout/session", (req, res) => {
    req.logout((error) => {
        if (error) throw new ApiError(500, error.message, "LOGIN FAILED")

        req.session.destroy((error) => {
            if (error) throw new ApiError(500, error.message, "SESSION ID FAILED TO DESTROY")
            res.clearCookie('connect.sid');
            throw new ApiResponse(200, "Logged out successfully")
        })

    })

}); 
