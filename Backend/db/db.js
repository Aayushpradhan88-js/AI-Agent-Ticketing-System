import mongoose from "mongoose"

const DB_NAME = "PERSONALSTORAGEMANAGEMENTDRIVE"

const MONGODB_URI="mongodb+srv://aayush:aayush12345@cluster0.hwmd9ql.mongodb.net/"


export const dbConnection = async () => {
  try {
    const connectionString = await mongoose.connect(
      `${MONGODB_URI}/${DB_NAME}`
    )
    return console.log("MONGODB IS SUCCESSFULLY CONNECTED")
  } catch (error) {
    console.log("MONGODB CONNECTION IS FAILED", error)
    process.exit(1)
  }
}