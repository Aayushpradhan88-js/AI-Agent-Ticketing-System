import express from "express"
import {
    createTicket,
    getAllTickets,
    getTicketById,
    adminAssignTicket,
    adminUpdateTicketStatus,
    adminDeleteTicket
} from "../controllers/ticket.controller.js";
import { authenticate } from "../middlewares/auth.js";

export const ticketRoute = express.Router();

// Regular ticket routes
ticketRoute.post("/create-ticket", authenticate, createTicket);
ticketRoute.get("/get-all-tickets", authenticate, getAllTickets);
ticketRoute.get("/get-ticket/:id", authenticate, getTicketById);

// Admin-only ticket management routes
ticketRoute.post("/admin/assign/:ticketId", authenticate, adminAssignTicket);
ticketRoute.patch("/admin/status/:ticketId", authenticate, adminUpdateTicketStatus);
ticketRoute.delete("/admin/delete/:ticketId", authenticate, adminDeleteTicket);
