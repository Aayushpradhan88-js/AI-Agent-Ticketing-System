import mongoose from "mongoose";
function mongodb() {
    mongoose.connect(process.env.MONGO_URL)
    console.log("Connected to MongoDB");
}
export default mongodb;