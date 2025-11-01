import { inngest } from "../client.js";
import { User } from "../../models/user.models.js";
import { sendMail } from "../../utils/Node-mailer.utils.js";
import { ApiError } from "../../utils/ApiError.utils.js";
import { ApiResponse } from "../../utils/ApiResponse.utils.js";
import { NonRetriableError } from "inngest";

export const onSigningUp = inngest.createFunction(
    {
        id: "on-user-signup",
        retries: 2
    },
    { event: "user/signup" },

    async ({ event, step }) => {
        try {

            //PIPELINE - 1
            const { email } = event.data
            //-----fetch data from the database-----//
            const user = await step.run("get-user-email", async () => {
                const userObject = await User.findOne({ email })
                if (!userObject) {
                    throw new NonRetriableError("User is not longer existed in the database")
                }

                return userObject;

            })

            //PIPELINE - 2
            await step.run("send-welcome-email", async () => {
                const subject = `Welcome to the app`;
                const message = `Hi,\n\nThanks for signing up. We're glad to have you onboard!`;

                await sendMail(user.email, subject, message);
            });

            return {
                message: "Successfully sent welcome email to user",
                email: user.email,
                status: "success"
            };

        }
        catch (error) {
            throw new ApiError(500, "Failed to send mail to user. SERVER ERROR", error.message)
        }
    }
)