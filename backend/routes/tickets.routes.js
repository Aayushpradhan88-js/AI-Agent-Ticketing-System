import express from "express"
import { createTicket } from "../controllers/ticket.controller";

export const ticketRoute = express.Router();

ticketRoute.get("/tickets", createTicket,);
ticketRoute.get("/tickets/:id",);