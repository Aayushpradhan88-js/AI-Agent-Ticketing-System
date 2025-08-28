import express from "express";

import {
    registerAccount,
    loginAccount,
    logoutAccount,
    updateAccount,
    getAllAccountUsers
} from "../controllers/user.controller.js";

import { authenticate } from "../middlewares/auth.js";

export const authRoute = express.Router();

authRoute.post("/signup", registerAccount);
authRoute.post("/login", loginAccount);
authRoute.post("/logout", logoutAccount);

authRoute.post("/update-account", authenticate, updateAccount);
authRoute.get("/get-users-account", authenticate, getAllAccountUsers);