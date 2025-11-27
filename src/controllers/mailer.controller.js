// mailer.controller.js
const nodemailer = require("nodemailer");
require('dotenv').config();

console.log('🔧 Configuración de correo:');
console.log('User:', process.env.MAILER_USER);
console.log('Pass configurado:', process.env.MAILER_PASS ? 'Sí ✅' : 'No ❌');

// Configuración del transporter con host y puerto explícitos
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true para 465, false para otros puertos
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASS,
  },
  tls: {
    rejectUnauthorized: false // Para evitar problemas de certificados en algunos servidores
  }
});

// Verificar la configuración al iniciar
transporter.verify(function (error, success) {
  if (error) {
    console.error('❌ Error en configuración de Nodemailer:', error);
  } else {
    console.log('✅ Servidor SMTP de Gmail listo para enviar mensajes');
  }
});

// Función para enviar correos
const sendEmails = async (emails, subject, htmlBody, attachments = []) => {
  console.log('📧 Intentando enviar correos a:', emails);
  
  if (!emails || emails.length === 0) {
    throw new Error("No se proporcionaron correos electrónicos");
  }

  try {
    const mailOptions = emails.map((email) => ({
      from: process.env.MAILER_USER,
      to: email,
      subject,
      html: htmlBody,
      attachments
    }));

    console.log('📮 Enviando', mailOptions.length, 'correos...');
    
    const results = await Promise.all(
      mailOptions.map((options) => transporter.sendMail(options))
    );
    
    console.log('✅ Correos enviados exitosamente:', results.length);
    return results;
    
  } catch (error) {
    console.error('❌ Error detallado al enviar correos:', error);
    throw error;
  }
};

module.exports = { sendEmails };