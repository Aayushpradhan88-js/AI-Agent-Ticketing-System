/*
ALGORITHM FOR CREATING TICKET

1. getting title and desciption from the frontend
2. Not given throw error
3. create the ticket
4. using inngesT

*/
import { Ticket } from "../models/ticket.models.js";
import { ApiError } from "../utils/ApiError.utils.js"
import { ApiResponse } from "../utils/ApiResponse.utils.js"
import { inngest } from "../inngest/client.js"


//-----CREATING TICKET-----//
export const createTicket = async (req, res) => {
    const { title, description } = req.body

    if (!title || !description) {
        return res
            .status(402)
            .json(
                new ApiError(402, "title or description is required")
            );
    }

    try {
        const newTicket = await Ticket.create(
            {
                title,
                description,
                createdBy: req.user._id.toString()
            }
        );

        await inngest.send(
            {
                name: "ticket/created", //---hit the function (on-ticket-created)---//
                data: {
                    ticketId: newTicket._id.toString(),
                    title,
                    description,
                    createdBy: req.user._id.toString()
                }
            }
        );

        res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    "ticket created successfully & processing has been started",
                    newTicket
                )
            )
    }
    catch (error) {
        console.error("Error creating ticket:", error);
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

//-----GET ALL TICKETS-----//
export const getAllTickets = async (req, res) => {
    try {
        const user = req.user;
        let tickets;

        if (user.role !== 'user') {
            tickets = await Ticket
                .find({})
                .populate("assignedTo", ["_id", "email", "username"])
                .sort({ createdAt: -1 })
        }
        else {
            tickets = await Ticket
                .find({ createdBy: user._id })
                .select("title description status createdAt")
                .sort({ createdAt: -1 })
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    "Tickets fetched successfully",
                    tickets
                )
            )
    }
    catch (error) {
        console.error("Error fetching tickets:", error);
        return res
            .status(500)
            .json(
                new ApiError(
                    500,
                    "INTERNAL SERVER ERROR"
                )
            )
    };
};

//-----GET TICKET By Id-----//
export const getTicketById = async (req, res) => {
    try {
        const user = req.user;
        let ticket;

        if (user.role === "admin") {
            //-----Admin can see all tickets-----//
            ticket = await Ticket.findById(req.params.id)
                .populate(
                    "assignedTo",
                    [
                        "_id",
                        "username",
                        "email",
                    ]
                )
                .populate(
                    "createdBy",
                    [
                        "_id",
                        "username",
                        "email",
                    ]
                );
        }

        else {
            //-----Users can only see their own tickets-----//
            ticket = await Ticket.findOne(
                {
                    createdBy: user._id,
                    _id: req.params.id
                }
            )
                .select("title description status createdAt createdBy")
                .populate(
                    "createdBy",
                    [
                        "_id",
                        "username",
                        "email",
                    ]
                );
        }

        if (!ticket) {
            return res
                .status(404)
                .json(
                    new ApiError(
                        404,
                        "Ticket not found"
                    )
                )
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    "Ticket fetched successfully",
                    ticket
                )
            )
    }
    
    catch (error) {
        console.error("Error fetching ticket:", error.message);
        return res
            .status(500)
            .json(
                new ApiError(
                    500,
                    "Internal Server Error"
                )
            );
    }
};
