// // mailer.controller.js
// const nodemailer = require("nodemailer");
// require('dotenv').config();


// // Configuración del transporter
// const transporter = nodemailer.createTransport({
//   service: process.env.MAILER_SERVICE,
//   auth: {
//     user: process.env.MAILER_USER,
//     pass: process.env.MAILER_PASS,
//   },
// });

// // Función para enviar correos
// const sendEmails = async (emails, subject, htmlBody, attachments = []) => {
//   if (!emails || emails.length === 0) {
//     throw new Error("No se proporcionaron correos electrónicos");
//   }


//   try {
//     const mailOptions = emails.map((email) => ({
//       from: "pagina.pechugon@gmail.com",
//       to: email,
//       subject,
//       html: htmlBody,
//       attachments
//     }));

//     // Enviar los correos
//     await Promise.all(mailOptions.map((options) => transporter.sendMail(options)));
//   } catch (error) {
//     console.error('Error al enviar correos:', error);
//     throw new Error('Error al enviar correos');
//   }
// };

// module.exports = { sendEmails };

// mailer.controller.js
const { Resend } = require('resend');
require('dotenv').config();

// Inicializar Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Solo para depuración en Render
console.log("🔧 Configuración de Resend:");
console.log("API Key configurado:", process.env.RESEND_API_KEY ? "Sí ✅" : "No ❌");

// Función principal
const sendEmails = async (emails, subject, htmlBody, attachments = []) => {
  if (!emails || emails.length === 0) {
    throw new Error("No se proporcionaron correos electrónicos");
  }

  console.log("📧 Enviando correos con Resend...");
  console.log("Destinatarios:", emails);

  const results = [];

  for (const email of emails) {
    try {
      console.log(`  → Enviando a: ${email}`);

      const result = await resend.emails.send({
        from: "Pechu Events <onboarding@resend.dev>", // puedes cambiarlo si quieres
        to: email,
        subject,
        html: htmlBody,
        attachments,
      });

      if (result?.data) {
        console.log(`  ✅ Enviado a ${email} - ID: ${result.data.id}`);
        results.push(result);
      } else if (result?.error) {
        console.error(`  ❌ Error al enviar a ${email}:`, result.error);
      }

    } catch (error) {
      console.error(`  ❌ Excepción al enviar a ${email}:`, error.message);
    }
  }

  console.log(`📮 Finalizado → ${results.length} enviados de ${emails.length}`);
  return results;
};

module.exports = { sendEmails };
