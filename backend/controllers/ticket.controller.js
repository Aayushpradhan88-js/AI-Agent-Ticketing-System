/*
ALGORITHM FOR CREATING TICKET

1. getting title and desciption from the frontend
2. if it is not given throw error
3. create the ticket
4. using inngest==
*/
import { Ticket } from "../models/ticket.models.js";
import { ApiError } from "../utils/ApiError.utils.js"
import { ApiResponse } from "../utils/ApiResponse.utils.js"

export const createTicket = async (req, res) => {
    const { title, description } = req.body

    if (!title || !description) {
        new ApiError(402, "title or description is required");
    };
    try {

        const newTicket = Ticket.create(
            {
                title,
                description,
                createdBy: req.user._id.toString()
            }
        );

        await inngest.send(
            {
                name: "ticket/created",
                data: {
                    ticketId: (await newTicket)._id.toString(),
                    title,
                    description,
                    createdBy: req.user._id.toString()
                }
            }
        );

        res
            .send(200)
            .json(

                new ApiResponse(
                    200,
                    "ticket created successfully & processing has been started",
                    newTicket
                )

            )
    }

    catch (error) {
        res
            .status(500)
            .json(
                new ApiError(
                    500,
                    "INTERNAL SERVER ERROR, TICKET IS NOT CREATED",
                    error
                )
            );
    }
};

export const getAllTickets = async (req, res) => {
    try {
        const user = req.user;
        const tickets = [];

        if (user.role != 'user') {
            tickets = Ticket
                .find({})
                .populate("assigned To", ["id", "email"])
                .sort({ createdBy: -1 })
        }

        else {
            tickets = await Ticket
                .find({ createdBy: user._id })
                .select("title and description status createdAt")
                .sort({ createdBy: -1 })
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    tickets
                )
            )
    }

    catch (error) {
        return res
        .status(200)
        .json(
            new ApiError(
                500,
                "INTERNAL SERVER ERROR"
            )
        )
    };
};

export const getTicket = async(req, res) => {
    
}