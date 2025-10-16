/*
ALGORITHM FOR CREATING TICKET

1. getting title and desciption from the frontend
2. create the ticket
4. using inngesT

*/
import { Ticket } from "../models/ticket.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.utils.js"
import { ApiResponse } from "../utils/ApiResponse.utils.js"
import { inngest } from "../inngest/client.js"


//-----CREATING TICKET-----//
export const createTicket = async (req, res) => {
    const { title, description, hashtags } = req.body
    console.log(title, description, hashtags)

    if (!title || !description || !hashtags) {
        return res
            .status(402)
            .json(
                new ApiError(402, "title, description and hashtags is required")
            );
    }

    try {
        const newTicket = await Ticket.create(
            {
                title,
                description,
                hashtags,
                createdBy: req.user._id.toString()
            }
        );
        console.log(newTicket)

        await inngest.send(
            {
                name: "ticket/created", //---hit the function (on-ticket-created)---//
                data: {
                    ticketId: newTicket._id.toString(),
                    title,
                    description,
                    hashtags,
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
        // console.log(user);
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
        console.log(tickets);
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    tickets,
                    "Tickets fetched successfully",
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
                    ticket,
                    "Ticket fetched successfully",
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

//-----ADMIN ASSIGN TICKET-----//
export const adminAssignTicket = async (req, res) => {
    const { ticketId } = req.params;
    const { assigneeId } = req.body;

    try {
        // Check if user is admin or moderator
        if (req.user.role !== "admin" && req.user.role !== "moderator") {
            return res
                .status(403)
                .json(
                    new ApiError(403, "Access denied. Admin or moderator privileges required.")
                );
        }

        // Find the ticket
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res
                .status(404)
                .json(
                    new ApiError(404, "Ticket not found")
                );
        }

        // Validate assignee if provided
        if (assigneeId) {
            const assignee = await User.findById(assigneeId);
            if (!assignee) {
                return res
                    .status(404)
                    .json(
                        new ApiError(404, "Assignee user not found")
                    );
            }
        }

        // Update ticket assignment
        const updatedTicket = await Ticket.findByIdAndUpdate(
            ticketId,
            { assignedTo: assigneeId || null },
            { new: true }
        )
            .populate("assignedTo", ["_id", "username", "email"])
            .populate("createdBy", ["_id", "username", "email"]);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    assigneeId ? "Ticket assigned successfully" : "Ticket unassigned successfully",
                    updatedTicket
                )
            );
    } catch (error) {
        console.error("Error assigning ticket:", error);
        return res
            .status(500)
            .json(
                new ApiError(
                    500,
                    "INTERNAL SERVER ERROR, FAILED TO ASSIGN TICKET"
                )
            );
    }
};

//-----ADMIN UPDATE TICKET STATUS-----//
export const adminUpdateTicketStatus = async (req, res) => {
    const { ticketId } = req.params;
    const { status } = req.body;

    try {
        // Check if user is admin or moderator
        if (req.user.role !== "admin" && req.user.role !== "moderator") {
            return res
                .status(403)
                .json(
                    new ApiError(403, "Access denied. Admin or moderator privileges required.")
                );
        }

        // Validate status
        const validStatuses = ["active", "in-progress", "resolved", "closed"];
        if (!validStatuses.includes(status)) {
            return res
                .status(400)
                .json(
                    new ApiError(400, "Invalid status. Valid statuses are: " + validStatuses.join(", "))
                );
        }

        // Find and update ticket
        const updatedTicket = await Ticket.findByIdAndUpdate(
            ticketId,
            { status },
            { new: true }
        )
            .populate("assignedTo", ["_id", "username", "email"])
            .populate("createdBy", ["_id", "username", "email"]);

        if (!updatedTicket) {
            return res
                .status(404)
                .json(
                    new ApiError(404, "Ticket not found")
                );
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    "Ticket status updated successfully",
                    updatedTicket
                )
            );
    } catch (error) {
        console.error("Error updating ticket status:", error);
        return res
            .status(500)
            .json(
                new ApiError(
                    500,
                    "INTERNAL SERVER ERROR, FAILED TO UPDATE TICKET STATUS"
                )
            );
    }
};

//-----ADMIN DELETE TICKET-----//
export const adminDeleteTicket = async (req, res) => {
    const { ticketId } = req.params;

    try {
        // Check if user is admin
        if (req.user.role !== "admin") {
            return res
                .status(403)
                .json(
                    new ApiError(403, "Access denied. Admin privileges required.")
                );
        }

        // Find and delete ticket
        const deletedTicket = await Ticket.findByIdAndDelete(ticketId);

        if (!deletedTicket) {
            return res
                .status(404)
                .json(
                    new ApiError(404, "Ticket not found")
                );
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    "Ticket deleted successfully",
                    { deletedTicketId: ticketId }
                )
            );
    } catch (error) {
        console.error("Error deleting ticket:", error);
        return res
            .status(500)
            .json(
                new ApiError(
                    500,
                    "INTERNAL SERVER ERROR, FAILED TO DELETE TICKET"
                )
            );
    }
};
