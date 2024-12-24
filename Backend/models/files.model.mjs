import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    fileName: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    UploadAt: {
        type: Date,
        default: Date.now
    },
    sharedWith: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
})

const userFiles = mongoose.model('File', fileSchema);

export default userFiles;