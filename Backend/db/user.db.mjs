import mongoose from "mongoose";

let mongodb = () => {
    mongoose.connect(process.env.MONGO_URL).then(() => {
        console.log("Connected to MongoDB");
    })
    // console.log("Connected to MongoDB");

}
export default mongodb;