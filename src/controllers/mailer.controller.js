// mailer.controller.js
const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

console.log('🔧 Configuración de Resend:');
console.log('API Key configurado:', process.env.RESEND_API_KEY ? 'Sí ✅' : 'No ❌');

// Función para enviar correos
const sendEmails = async (emails, subject, htmlBody, attachments = []) => {
  console.log('📧 Intentando enviar correos a:', emails);
  
  if (!emails || emails.length === 0) {
    throw new Error("No se proporcionaron correos electrónicos");
  }

  try {
    console.log('📮 Enviando', emails.length, 'correos con Resend...');
    
    const emailPromises = emails.map((email) => 
      resend.emails.send({
        from: 'Pechu Events <onboarding@resend.dev>',
        to: email,
        subject: subject,
        html: htmlBody,
      })
    );

    const results = await Promise.all(emailPromises);
    
    console.log('✅ Correos enviados exitosamente:', results.length);
    console.log('IDs de correos:', results.map(r => r.data?.id));
    return results;
    
  } catch (error) {
    console.error('❌ Error detallado al enviar correos:', error);
    throw error;
  }
};

module.exports = { sendEmails };