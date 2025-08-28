import express from "express"
import {
    createTicket,
    getAllTickets,
    getTicketById
} from "../controllers/ticket.controller.js";
import { authenticate } from "../middlewares/auth.js";

export const ticketRoute = express.Router();

ticketRoute.get("/", authenticate, createTicket,);
ticketRoute.get("/:id", authenticate, getTicketById);
ticketRoute.get("/", authenticate, getAllTickets);