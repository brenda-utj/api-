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
    
    // Enviar correos uno por uno para ver cuál falla
    const results = [];
    for (const email of emails) {
      try {
        console.log(`  → Enviando a: ${email}`);
        const result = await resend.emails.send({
          from: 'Pechu Events <onboarding@resend.dev>',
          to: email,
          subject: subject,
          html: htmlBody,
        });
        
        if (result.data) {
          console.log(`  ✅ Enviado a ${email} - ID: ${result.data.id}`);
          results.push(result);
        } else if (result.error) {
          console.error(`  ❌ Error al enviar a ${email}:`, result.error);
        }
      } catch (emailError) {
        console.error(`  ❌ Excepción al enviar a ${email}:`, emailError.message);
      }
    }
    
    console.log('✅ Proceso completado. Enviados:', results.length, 'de', emails.length);
    return results;
    
  } catch (error) {
    console.error('❌ Error detallado al enviar correos:', error);
    throw error;
  }
};

module.exports = { sendEmails };
