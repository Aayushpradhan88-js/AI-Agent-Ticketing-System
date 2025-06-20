import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
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
    uploadAt: {
        type: Date,
        default: Date.now
    },
    sharedWith: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserModel'
        }
    ],
});

 const userfile = mongoose.model('userfile', fileSchema);
 export {userfile}