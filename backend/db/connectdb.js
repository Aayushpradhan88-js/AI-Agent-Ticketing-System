import mongoose from 'mongoose'
import { DB_NAME } from '../utils/Constants.utils.js'

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log(`\n MongoDB CONNECTED !! DB HOST: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.error("CONNECTION ERR: ", error)
        process.exit(1)
    }
}

export default connectDB