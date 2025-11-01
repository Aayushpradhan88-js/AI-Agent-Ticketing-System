/*
ALGORITHM

1. FETCH TICKET ID FROM THE DB
2. UPDATE-TICKET STATUS (if want to update it)
3. ANALYZING TICKET
4. ACCORDING TO TICKET GENERATING RELATED SKILLS
5. ASSIGN MODERATOR ACCORDING TO RELATED SKILLS
6. SEND EMAIL NOTIFICATION 

*/

import { inngest } from '../client.js'
import { Ticket } from '../../models/ticket.models.js'
// import { ApiError } from '../../utils/ApiError.utils.js';
import { NonRetriableError } from 'inngest';
import { analyzeTicket } from '../../utils/AnalyzeTicket.utils.js';
import { User } from '../../models/user.models.js';
import { sendMail } from '../../utils/Node-mailer.utils.js';

export const onTicketCreated = inngest.createFunction(
    {
        id: "on-ticket-created",
        retries: 2
    },
    { event: 'ticket/created' },

    async ({ event, step }) => {

        const { ticketId } = event.data;

        try {
            //PIPELINE-1
            const ticket = await step.run("fetch-ticket", async () => {
                const ticketData = await Ticket.findById(ticketId);
                if (!ticketData) throw new NonRetriableError("ticket is not found!!!!!");

                return ticketData;
            });

            //PIPELINE-2
            await step.run("update-ticket-status", async () => {
                await Ticket.findByIdAndUpdate(ticket._id, { status: "In progress" });
            });

            const aiResponse = await analyzeTicket(ticket);

            const relatedSkills = await step.run("ai-processing", async () => {
                let skills = [];
                if (aiResponse) {
                    await Ticket.findByIdAndUpdate(ticket._id, {
                        priority: !["low", "high", "medium"].includes(aiResponse.priority)
                            ? "medium"
                            : aiResponse.priority,
                        helpfulNotes: aiResponse.helpfulNotes,
                        status: "IN_PROGRESS",
                        relatedSkills: aiResponse.relatedSkills
                    })
                    skills = aiResponse.relatedSkills
                }
                return skills;
            });

            //PIPELINE-3 
            //ASSIGNING TO MODERATOR
            const assignModerator = await step.run("assign-moderator", async () => {
                let user = await User.findOne( //---finding single document
                    {
                        role: "moderator",
                        skills: {
                            $elemMatch: {
                                $regex: relatedSkills.join("|"),
                                $elemMatch: "i"
                            }
                        }
                    }
                )
                if (!user) { //---if not moderator, find admin
                    user = await User.findOne({ role: "admin" });
                };

                //----assigning user id to the ticket who created----//
                await Ticket.findByIdAndUpdate(ticket._id, {
                    assignedTo: user?._id || null,
                });

                return user;
            });

            //PIPELINE-4
            //-----SENDING NOTIFICATION
            await step.run("send-mail", async () => {
                if (assignModerator) {
                    const finalTicket = await Ticket.findById(ticket._id);
                    await sendMail(
                        assignModerator.email,
                        {
                            subject: "New Ticket Assigned",
                            text: `You have been assigned a new ticket: ${finalTicket.title}`
                        }
                    );
                }
            });

            return ({ success: true });
        } catch (error) {
            console.error("❌ Error running the step", error.message);
            return { success: false };
        }
    }
)