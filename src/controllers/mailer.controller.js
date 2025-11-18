// mailer.controller.js
const nodemailer = require("nodemailer");
require('dotenv').config();


// Configuración del transporter
const transporter = nodemailer.createTransport({
  service: process.env.MAILER_SERVICE,
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASS,
  },
});

// Función para enviar correos
const sendEmails = async (emails, subject, htmlBody, attachments = []) => {
  if (!emails || emails.length === 0) {
    throw new Error("No se proporcionaron correos electrónicos");
  }


  try {
    const mailOptions = emails.map((email) => ({
      from: "pagina.pechugon@gmail.com",
      to: email,
      subject,
      html: htmlBody,
      attachments
    }));

    // Enviar los correos
    await Promise.all(mailOptions.map((options) => transporter.sendMail(options)));
  } catch (error) {
    console.error('Error al enviar correos:', error);
    throw new Error('Error al enviar correos');
  }
};

module.exports = { sendEmails };
