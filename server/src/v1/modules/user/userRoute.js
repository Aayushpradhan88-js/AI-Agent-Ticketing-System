import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

import {
    registerAccount,
    loginAccount,
    logoutAccount,
    updateAccount,
    getAllAccountUsers,
    adminUpdateUser,
    adminDeleteUser,
    adminToggleUserStatus,
    studentAccount,
    studentUpdateAccount,
    studentDeleteTicket,
    moderatorAccount,
    moderatorUpdateAccount,
    moderatorDeleteTicket,
} from "./userController.js";

import { authenticate as verifyingUser } from "../../../middlewares/auth.js";

export const authRoute = express.Router();

authRoute.post("/register", registerAccount);
authRoute.post("/login", loginAccount);
authRoute.post("/logout", logoutAccount);
authRoute.post("/update-account", verifyingUser, updateAccount);

//----------Admin routes----------//
authRoute.get("/get-users-account", verifyingUser, getAllAccountUsers);
authRoute.patch("/admin/user/:userId/update-account", verifyingUser, adminUpdateUser);
authRoute.delete("/admin/user/:userId", verifyingUser, adminDeleteUser);
authRoute.get("/admin/user/:userId/status", verifyingUser, adminToggleUserStatus);

//----------Moderator routes----------//
authRoute.get("/moderator",verifyingUser, moderatorAccount );
authRoute.patch("/moderator/:id/update-account", verifyingUser, moderatorUpdateAccount);
authRoute.delete("/moderator/:id/delete-ticket", verifyingUser, moderatorDeleteTicket);

//----------Student routes----------//
authRoute.get("/student",verifyingUser, studentAccount );
authRoute.patch("/student/:id/update-account", verifyingUser, studentUpdateAccount);
authRoute.delete("/student/:id/delete-ticket", verifyingUser, studentDeleteTicket);

//----------Google OAuth routes----------//
authRoute.get("/google",
    passport.authenticate("google", {
        scope: ["profile", "email"]
    })
);

authRoute.get("/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/login?error=oauth_failed"
    }),
    (req, res) => {
        //-----Successful authentication-----//
        const redirectUrl = process.env.CLIENT_URL || "http://localhost:5173";
        res.redirect(`${redirectUrl}/tickets?auth=success`);
    }
);

authRoute.get("/me", (req, res) => {
    if (req.user) {
        //-----Session-based authentication (OAuth)-----//
        res.json({
            success: true,
            user: req.user,
            authType: "session"
        });
    } else {
        //-----Check JWT token-----//
        const token = req.headers.authorization?.split(" ")[1];
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                res.json({
                    success: true,
                    user: decoded,
                    authType: "jwt"
                });
            } catch (error) {
                console.log(error.message)
                res.status(401).json({ success: false, message: "Invalid token" });
            }
        } else {
            res.status(401).json({ success: false, message: "Not authenticated" });
        }
    }
});

//----------Session-based logout----------//
authRoute.post("/logout/session", (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Logout failed" });
        }
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Session destroy failed" });
            }
            res.clearCookie('connect.sid'); // Clear session cookie
            res.json({ success: true, message: "Logged out successfully" });
        });
    });
});