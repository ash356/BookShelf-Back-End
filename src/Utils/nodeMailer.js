import nodemailer from "nodemailer";

const sendEmail = async ({
  to = [],
  cc, //  To Show  Other Receivers Emails
  bcc, // To Hide Other Receivers Emails
  subject,
  text,
  html,
  attachments = [],
} = {}) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_NAME, // Sender Email Name
      pass: process.env.EMAIL_PASSWORD, // Sender Email Password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `Book Shelf <${process.env.EMAIL_NAME}>`, // sender address
    to, // list of receivers
    cc,
    bcc,
    subject, // Subject line
    text, // plain text body
    html, // html body
    attachments,
  });
  return info;
};
export default sendEmail;
