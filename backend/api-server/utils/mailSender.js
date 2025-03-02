import nodemailer from "nodemailer";
export const sendMail = async (to, subject, body) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailData = {
      from: process.env.EMAIL,
      to,
      subject,
      html: body,
    };

    await transporter.sendMail(mailData);
    console.log("mail send");
    return { success: true, message: "Email Sent Successfully!" };
  } catch (error) {
    console.log("Error sending mail", error);
    throw new Error("Failed to send Email");
  }
};
