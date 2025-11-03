import dotenv from "dotenv"
dotenv.config()
import cors from "cors"
import express from "express"
import session from "express-session"
import passport from "passport"
import { serve } from "inngest/express"
import connectDB from "./src/config/connectdb.js"
import { authRoute } from "./src/v1/modules/user/userRoute.js"
import { ticketRoute } from "./src/v1/modules/ticket/ticketRoute.js"
import { onboardingRoute } from "./src/v1/modules/onboarding/onboardingRoute.js"
import { inngest } from "./src/inngest/client.js"
import { onSigningUp } from "./src/inngest/function/on-signup.js"
import { onTicketCreated } from "./src/inngest/function/on-ticket-created.js"
// import passport from "./src/config/passport.js"
import { serverPORT,clientURL, sessionSECRET } from "./src/config/env.js"

const app = express()
app.use(cors(
    {
        origin: clientURL || "http://localhost:5173",
        credentials: true
    }
))

app.use(express.urlencoded({ extended: true }))
app.use(express.json());

// Session configuration
app.use(session(
    {
        secret: sessionSECRET,
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

const PORT = serverPORT
app.listen(PORT || 3000, () => {
    console.log(`Server is running on PORT: ${PORT}`)
})