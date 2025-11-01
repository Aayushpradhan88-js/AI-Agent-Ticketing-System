import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}`)
        console.log(`\n MongoDB CONNECTED !! DB HOST: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.error("CONNECTION ERR: ", error)
        process.exit(1)
    }
}

export default connectDB;