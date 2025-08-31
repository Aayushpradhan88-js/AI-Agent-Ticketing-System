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


//-----CREATING TICKET-----//
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
                name: "ticket/created", //---hit the function (on-ticket-created)---//
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

//-----GET ALL TICKETS-----//
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

//-----GET TICKET By Id-----//
export const getTicketById = async (req, res) => {
    try {
        const user = req.user;
        let ticket;

        if (user.role !== "admin") {
            ticket = Ticket.findById(req.params.id).populate(
                "assignedTo",
                [
                    "emai",
                    "id"
                ]
            );
        }

        else {
            ticket = await Ticket.findOne(
                {
                    createdBy: user._id,
                    _id: req.params.id
                }
            ).select("title and description is createdBy")
        }

        if (!ticket) {
            res
                .status(404)
                .json(
                    new ApiError(
                        404,
                        "ticket not found",
                        ticket
                    )
                )
        }
    }

    catch (error) {
        console.error("Error fetching ticket", error.message);
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