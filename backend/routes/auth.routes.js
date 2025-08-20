import express from "express";

import {
    registerAccount,
    loginAccount,
    logoutAccount,
    updateAccount,
    getAllAccountUsers
} from "../controllers/user.controller";

export const authRoute = express.Router();

authRoute.post("/signup", registerAccount);
authRoute.post("/login", loginAccount);
authRoute.post("/logout", logoutAccount);
authRoute.post("/update-account", updateAccount);
authRoute.get("/get-users-account", getAllAccountUsers);