import {userFileSchema} from "../models/files.models";
import { cloudinary } from "../utils/cloudinayUtils";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";


export const upload = async(req, res) => {
    const {title, note, file} = req.body;

    if(!title || !note){
        return res
        .status(491)
        .json(
            new ApiError(
                401,
                "TITLE OR NOTE IS REQUIRED"
            )
        )
    };

    
    
}