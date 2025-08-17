import nodemailer from "nodemailer"

export const sendMail = async (to, subject, text, html) => {

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_SMTP_HOST,
      port: process.env.MAILTRAP_SMTP_PORT,
      secure: false, //--when deploying it delete this part auto present in prod..
      auth: {
        user: process.env.MAILTRAP_SMTP_USER,
        pass: process.env.MAILTRAP_SMTP_PASS,
      },
    });

    (async () => {
      const info = await transporter.sendMail({
        from: ' INNGEST AGENT TMS ',
        to,
        subject,
        text,
        html: "<b>Hello world?</b>",
      });

      console.log("Message sent:", info.messageId);
      return info
    })();
  }

  catch (error) {
    console.log("FAILED TO SEND EMAIL", error)
  }
}