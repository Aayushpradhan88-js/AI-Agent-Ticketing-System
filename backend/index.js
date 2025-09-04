import dotenv from "dotenv"
dotenv.config()
import cors from "cors"
import express from "express"

import { serve } from "inngest/express"
import connectDB from "./db/connectdb.js"
import { authRoute } from "./routes/auth.routes.js"
import { ticketRoute } from "./routes/tickets.routes.js"
import { inngest } from "./inngest/client.js"
import { onSigningUp } from "./inngest/function/on-signup.js"
import { onTicketCreated } from "./inngest/function/on-ticket-created.js"

const app = express()
app.use(cors())

app.use(express.urlencoded({ extended: true }))
app.use(express.json());

connectDB();

app.use("/api/v1/auth", authRoute);
app.use("/api/tickets", ticketRoute);
app.use("/api/inngest", serve({
    client: inngest,
    functions: [onSigningUp, onTicketCreated]
}))

app.get("/home", (req, res) => {
    res.send("welcome to home!!")
});

console.log("mongodb uri", process.env.MONGO_URI)

const PORT = process.env.PORT
app.listen(PORT || 3000, () => {
    console.log(`Server is running on PORT: ${PORT}`)
})