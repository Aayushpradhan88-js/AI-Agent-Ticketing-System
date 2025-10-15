import dotenv from "dotenv"
dotenv.config()
import cors from "cors"
import express from "express"
import session from "express-session"
import passport from "passport"
import { serve } from "inngest/express"
import connectDB from "./db/connectdb.js"
import { authRoute } from "./routes/auth.routes.js"
import { ticketRoute } from "./routes/tickets.routes.js"
import { inngest } from "./inngest/client.js"
import { onSigningUp } from "./inngest/function/on-signup.js"
import { onTicketCreated } from "./inngest/function/on-ticket-created.js"

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
app.use("/api/inngest", serve({
    client: inngest,
    functions: [onSigningUp, onTicketCreated]
}))

console.log("mongodb uri", process.env.MONGO_URI)

const PORT = process.env.PORT
app.listen(PORT || 3000, () => {
    console.log(`Server is running on PORT: ${PORT}`)
})