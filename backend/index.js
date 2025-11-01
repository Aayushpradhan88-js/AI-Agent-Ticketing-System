import dotenv from "dotenv"
dotenv.config()
import cors from "cors"
import express from "express"
import session from "express-session"
import passport from "passport"
import { serve } from "inngest/express"
import connectDB from "./db/connectdb.js"
import { authRoute } from "./user/userRoute.js"
import { ticketRoute } from "./v1/ticket/ticketRoute.js"
import { onboardingRoute } from "./v1/onboarding/onboardingRoute.js"
import { inngest } from "./v1/inngest/client.js"
import { onSigningUp } from "./v1/inngest/function/on-signup.js"
import { onTicketCreated } from "./v1/inngest/function/on-ticket-created.js"

import "./config/passport.js"

const app = express()
app.use(cors(
    {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true
    }
))

app.use(express.urlencoded({ extended: true }))
app.use(express.json());

// Session configuration
app.use(session(
    {
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            // secure: process.env.NODE_ENV === 'production', //--HOLD---//
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        }
    }));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

connectDB();

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/tickets", ticketRoute);
app.use("/api/v1/onboarding", onboardingRoute);
app.use("/api/inngest", serve({
    client: inngest,
    functions: [onSigningUp, onTicketCreated]
}))

console.log("mongodb uri", process.env.MONGO_URI)

const PORT = process.env.PORT
app.listen(PORT || 3000, () => {
    console.log(`Server is running on PORT: ${PORT}`)
})