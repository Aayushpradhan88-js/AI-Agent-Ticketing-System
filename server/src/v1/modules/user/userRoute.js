import express from "express";
import {
    registerAccount,
    loginAccount,
    logoutAccount,
    updateAccount,
    getAllAccountUsers,
    adminUpdateUser,
    adminDeleteUser,
    adminToggleUserStatus,
    // studentAccount,
    // studentUpdateAccount,
    // studentDeleteTicket,
    // moderatorAccount,
    // moderatorUpdateAccount,
    // moderatorDeleteTicket,
} from "./userController.js";

import { authenticateUser as verifyingUser } from "../../../middlewares/auth.js";

export const authRoute = express.Router();

authRoute.post("/register", registerAccount);
authRoute.post("/login", verifyingUser ,loginAccount);
authRoute.post("/logout", logoutAccount);
authRoute.post("/update-account", verifyingUser, updateAccount);

//----------Admin routes----------//
authRoute.get("/get-users-account", verifyingUser, getAllAccountUsers);
authRoute.patch("/admin/user/:userId/update-account", verifyingUser, adminUpdateUser);
authRoute.delete("/admin/user/:userId", verifyingUser, adminDeleteUser);
authRoute.get("/admin/user/:userId/status", verifyingUser, adminToggleUserStatus);

//----------Moderator routes----------//
// authRoute.get("/moderator",verifyingUser, moderatorAccount );
// authRoute.patch("/moderator/:id/update-account", verifyingUser, moderatorUpdateAccount);
// authRoute.delete("/moderator/:id/delete-ticket", verifyingUser, moderatorDeleteTicket);

// //----------Student routes----------//
// authRoute.get("/student",verifyingUser, studentAccount );
// authRoute.patch("/student/:id/update-account", verifyingUser, studentUpdateAccount);
// authRoute.delete("/student/:id/delete-ticket", verifyingUser, studentDeleteTicket);