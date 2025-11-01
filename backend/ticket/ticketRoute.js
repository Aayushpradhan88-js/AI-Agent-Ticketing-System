import express from "express"
import {
    createTicket,
    getAllTickets,
    getTicketById,
    adminAssignTicket,
    adminUpdateTicketStatus,
    adminDeleteTicket
} from "./ticketController.js"

import { authenticateUser as checkAuth } from "../middlewares/auth.js";
import { onboarding as checkOnboarding } from "../middlewares/checkOnboarding.js"

export const ticketRoute = express.Router();

// Regular ticket routes
ticketRoute.post("/create-ticket", checkAuth, createTicket);
ticketRoute.get("/get-all-tickets", checkAuth, checkOnboarding, getAllTickets);
ticketRoute.get("/get-ticket/:id", checkAuth, checkOnboarding, getTicketById);

// Admin-only ticket management routes
ticketRoute.post("/admin/assign/:ticketId", checkAuth, adminAssignTicket);
ticketRoute.patch("/admin/status/:ticketId", checkAuth, adminUpdateTicketStatus);
ticketRoute.delete("/admin/delete/:ticketId", checkAuth, adminDeleteTicket);
