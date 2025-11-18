// evento.controller.js
const mongoose = require('mongoose');
const Evento = require('../models/evento.model');
const User = require('../models/user.model');
const { sendEmails } = require('../controllers/mailer.controller');

const eventoCtrl = {};

// Función para formatear la hora
function formatTime(timeString) {
  const [hours, minutes] = timeString.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
}

// Crear un nuevo evento
eventoCtrl.createEvent = async (req, res) => {
  try {
    const userAdd = await User.findById(req.params.userId);
    if (!userAdd) {
      return res.status(404).json({ mensaje: 'No se encontró al usuario' });
    }

    // Como no hay multer, attached siempre estará vacío
    const attachedFiles = [];

    const newEvent = new Evento({
      ...req.body,
      attached: attachedFiles,
      userAdd,
      userUpd: null,
      userDel: null,
      activo: 1,
    });

    const eventSaved = await newEvent.save();

    if (req.body.emails && req.body.emails.length > 0) {
      await sendInvitationsEmails(eventSaved);
      await Evento.updateOne(
        { _id: eventSaved._id }, 
        { $set: { "emails.$[].emailSent": true } }
      );
    }

    await sendEmailToEventCreatorOrEditor(eventSaved, false);

    res.status(201).json(eventSaved);
  } catch (error) {
    console.error('Error al crear evento:', error);
    res.status(500).json({ error: error.message });
  }
};

const sendInvitationsEmails = async (eventSaved, isUpdated = false) => {
  const emailsToSend = eventSaved.emails
    .filter(email => !email.emailSent)
    .map(email => email.email);

  const subject = isUpdated ? 'Actualización de evento' : 'Invitación para Evento';
  const googleMapsLink = `https://www.google.com/maps?q=${eventSaved.location.lat},${eventSaved.location.lng}`;

  const htmlBody = `
    <div style="width: 90%; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); padding: 20px; text-align: center;">
      <img src="https://www.pechugon.com.mx/assets/img/cropped-Site-Icon.png" alt="Logo" style="width: 500px; height: auto; margin-bottom: 20px;">  
      <hr>
      <h1>${isUpdated ? 'La información del evento fue actualizada' : '¡Estás invitado/a!'}</h1>
      <p><strong>Evento:</strong> ${eventSaved.name}</p>
      <p><strong>Descripción:</strong> ${eventSaved.description}</p>
      <p><strong>Fecha:</strong> ${new Date(eventSaved.date).toLocaleDateString()}</p>
      <p><strong>Hora:</strong> ${formatTime(eventSaved.time)}</p>
      <p><strong>Lugar:</strong> ${eventSaved.place}</p>
      <p><strong>Dirección:</strong> ${eventSaved.address}</p>
      <p><a href="${googleMapsLink}" target="_blank">Ver en Google Maps</a></p>
      <hr>
      <p>Pollo Pechugón Rosticerías</p>
    </div>
  `;

  await sendEmails(emailsToSend, subject, htmlBody, []);
};

// Email para el creador del evento
const sendEmailToEventCreatorOrEditor = async (eventSaved, isUpdated = false) => {
  const user = isUpdated ? eventSaved.userUpd : eventSaved.userAdd;

  const subject = isUpdated ? 'Editaste la información del Evento' : 'Creaste un nuevo evento';

  const htmlBody = `
    <div style="width: 90%; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; border-radius: 10px; padding: 20px; text-align: center;">
      <img src="https://www.pechugon.com.mx/assets/img/cropped-Site-Icon.png" alt="Logo" style="width: 500px; margin-bottom: 20px;">
      <h1>${isUpdated ? "El evento ha sido actualizado" : "Evento creado exitosamente"}</h1>
      <p><strong>Evento:</strong> ${eventSaved.name}</p>
      <p><strong>Descripción:</strong> ${eventSaved.description}</p>
      <p><strong>Fecha:</strong> ${new Date(eventSaved.date).toLocaleDateString()}</p>
      <p><strong>Hora:</strong> ${formatTime(eventSaved.time)}</p>
      <p><strong>Lugar:</strong> ${eventSaved.place}</p>
      <p><strong>Dirección:</strong> ${eventSaved.address}</p>
      <hr>
      <p>Pollo Pechugón Rosticerías</p>
    </div>
  `;

  await sendEmails([user.email], subject, htmlBody, []);
};

eventoCtrl.getAllEventos = async (req, res) => {
  try {
    const { month, year } = req.query; 
    const filter = { activo: 1 };

    if (month) {
      const selectedYear = year ? parseInt(year) : new Date().getFullYear();
      const selectedMonth = parseInt(month);

      if (isNaN(selectedYear) || isNaN(selectedMonth) || selectedMonth < 1 || selectedMonth > 12) {
        return res.status(400).json({ error: "Parámetros de mes o año no válidos" });
      }

      const startMonth = new Date(selectedYear, selectedMonth - 1, 1); 
      const endMonth = new Date(selectedYear, selectedMonth, 0, 23, 59, 59);

      filter.date = { $gte: startMonth, $lte: endMonth };
    }

    const events = await Evento.find(filter);
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

eventoCtrl.getEventoById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ mensaje: 'El ID proporcionado no es válido' });
  }

  try {
    const evento = await Evento.findOne({ _id: id, activo: 1 });

    if (!evento) {
      return res.status(404).json({ mensaje: 'Evento no encontrado o inactivo' });
    }

    res.status(200).json(evento);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

eventoCtrl.updateEvento = async (req, res) => {
  const { id } = req.params;

  const userUpd = await User.findById(req.params.userId);
  if (!userUpd) {
    return res.status(404).json({ mensaje: 'No se encontró al usuario' });
  }

  const updatedData = req.body;

  for (let field in updatedData) {
    if (updatedData[field] === null || updatedData[field] === '') {
      delete updatedData[field];
    }
  }

  try {
    // Como no hay multer, no se agregan archivos nuevos
    const attachedFiles = [];

    const evento = await Evento.findById(id);
    if (!evento) {
      return res.status(404).json({ mensaje: 'Evento no encontrado' });
    }

    updatedData.userUpd = userUpd;

    const eventUpdated = await Evento.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    if (eventUpdated.emails && eventUpdated.emails.length > 0) {
      await sendInvitationsEmails(eventUpdated, true);
      await Evento.updateOne(
        { _id: eventUpdated._id }, 
        { $set: { "emails.$[].emailSent": true } }
      );
    }

    await sendEmailToEventCreatorOrEditor(eventUpdated, true);

    res.status(200).json({
      mensaje: 'Evento actualizado con éxito',
      evento: eventUpdated
    });
  } catch (error) {
    res.status(500).json({ error: 'Ocurrió un error al actualizar el evento: ' + error.message });
  }
};

eventoCtrl.deleteEvento = async (req, res) => {
  const { id } = req.params;

  try {
    const userDel = await User.findById(req.params.userId);
    if (!userDel) {
      return res.status(404).json({ mensaje: 'No se encontró al usuario' });
    }

    const event = await Evento.findById(id);
    if (!event || !event.activo) {
      return res.status(404).json({ mensaje: 'Evento no encontrado' });
    }

    event.activo = 0;
    event.userDel = userDel;
    await event.save();

    res.status(200).json({
      mensaje: 'Evento eliminado con éxito',
      event
    });
  } catch (error) {
    res.status(500).json({ error: 'Ocurrió un error al eliminar el evento: ' + error.message });
  }
};

module.exports = eventoCtrl;
