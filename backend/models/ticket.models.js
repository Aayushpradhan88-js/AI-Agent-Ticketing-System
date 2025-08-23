import mongoose, { mongo } from "mongoose"

const ticketModel = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: String,
            default: "active"
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        },
        assignedTo: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            default: null
        },
        priority: {
            type: String,
        },
        deadline: {
            type: String
        },
        helpfulNotes: {
            type: String
        },
        relatedSkills: {
            type: String,
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
);

export const Ticket = mongoose.model("Ticket", ticketModel);