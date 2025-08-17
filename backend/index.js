import dotenv from "dotenv"
dotenv.config()
import express from "express"
import connectDB from "./db/connectdb.js"
const app = express()


app.use(express.urlencoded({extended:true}))
app.use(express.json());

connectDB();

app.get("/home", (req, res) => {
    res.send("welcome to home!!")
});

console.log("mongodb uri", process.env.MONGODB_URI)

const PORT = process.env.PORT
app.listen(PORT || 3000 , () => {
    console.log(`Server is running on PORT: ${PORT}`)
})