// evento.controller.js
const mongoose = require('mongoose');
const upload = require('../utils/file-upload');
const Evento = require('../models/evento.model');
const User = require('../models/user.model');
const { sendEmails } = require('../controllers/mailer.controller');

const multipleUpload = upload.array('files', 10);
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
    // Validar existencia del usuario
    const userAdd = await User.findById(req.params.userId);
    if (!userAdd) {
      return res.status(404).json({ mensaje: 'No se encontró al usuario' });
    }

    // Procesar los archivos adjuntos desde req.files (los archivos cargados por multer)
    const attachedFiles = req.files
      ? req.files.map((file) => ({
        fileName: file.originalname,
        url: file.location, 
      }))
      : [];

    // Crear el evento con los datos del formulario y los archivos adjuntos
    const newEvent = new Evento({
      ...req.body,
      attached: attachedFiles,
      userAdd,
      userUpd: null,
      userDel: null,
      activo: 1,
    });

    // Guardar el evento en la base de datos
    const eventSaved = await newEvent.save();

    if (req.body.emails && req.body.emails.length > 0) {
      await sendInvitationsEmails(eventSaved);
      await Evento.updateOne(
        { _id: eventSaved._id }, 
        {
          $set: { "emails.$[].emailSent": true }, // Actualizar la propiedad emailSent en todos los elementos del array emails
        }
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
    .filter(email => !email.emailSent) // Filtrar solo los correos no enviados
    .map(email => email.email);

  const subject = isUpdated ? 'Actualización de evento' : 'Invitación para Evento';
  const googleMapsLink = `https://www.google.com/maps?q=${eventSaved.location.lat},${eventSaved.location.lng}`;
  const htmlBody = `
    <div style="width: 90%; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); padding: 20px; text-align: center;">
      <img src="https://www.pechugon.com.mx/assets/img/cropped-Site-Icon.png" alt="Logo" style="width: 500px; height: auto; margin-bottom: 20px;">  
      <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
      <h1>${isUpdated ? 'La información del evento fue actualizada' : '¡Estás invitado/a!'}</h1>
      
      <p style="font-size: 18px;"><strong>Evento:</strong> ${eventSaved.name}</p>
      <p style="font-size: 18px;"><strong>Descripción:</strong> ${eventSaved.description}</p>
      <p style="font-size: 18px;"><strong>Fecha:</strong> ${new Date(eventSaved.date).toLocaleDateString()}</p>
      <p style="font-size: 18px;"><strong>Hora:</strong> ${formatTime(eventSaved.time)}</p>
      <p style="font-size: 18px;"><strong>Lugar:</strong> ${eventSaved.place}</p>
      <p style="font-size: 18px;"><strong>Dirección:</strong> ${eventSaved.address}</p>
      <p style="font-size: 18px;">
      <a href="${googleMapsLink}" target="_blank" 
         style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #ff5733; text-decoration: none; border-radius: 5px;">
         Ver en Google Maps
      </a>
    </p>
      <p style="font-size: 18px;">¡Te esperamos!</p>

      <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">

      <div style="font-size: 12px; color: #555;">
        <p>Pollo Pechugón Rosticerías Corp, C. Eca Do Queiros 5125, Jardines Universidad, 45110 Zapopan, Jalisco</p>
        <p>&copy; 2024 Pollo Pechugón Rosticerías. All rights reserved.</p>
      </div>
    </div>
  `;

  const attachments = eventSaved.attached.map(at => ({
    filename: at.fileName,
    path: at.url,
  }));

  await sendEmails(emailsToSend, subject, htmlBody, attachments);
};

// Email para el creador del evento
const sendEmailToEventCreatorOrEditor = async (eventSaved, isUpdated = false) => {
  const user = isUpdated ? eventSaved.userUpd : eventSaved.userAdd;

  const subject = isUpdated ? 'Editaste la información del Evento' : 'Creaste un nuevo evento';
  const htmlBody = `
    <div style="width: 90%; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); padding: 20px; text-align: center;">
      <img src="https://www.pechugon.com.mx/assets/img/cropped-Site-Icon.png" alt="Logo" style="width: 500px; height: auto; margin-bottom: 20px;">
      <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
      <h1>${isUpdated ? "El evento ha sido actualizado" : "Evento creado exitosamente"}</h1>
      
      <p style="font-size: 18px;"><strong>Evento:</strong> ${eventSaved.name}</p>
      <p style="font-size: 18px;"><strong>Descripción:</strong> ${eventSaved.description}</p>
      <p style="font-size: 18px;"><strong>Fecha:</strong> ${new Date(eventSaved.date).toLocaleDateString()}</p>
      <p style="font-size: 18px;"><strong>Hora:</strong> ${formatTime(eventSaved.time)}</p>
      <p style="font-size: 18px;"><strong>Lugar:</strong> ${eventSaved.place}</p>
      <p style="font-size: 18px;"><strong>Dirección:</strong> ${eventSaved.address}</p>
      <p style="font-size: 18px;">¡Te esperamos!</p>

      <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">

      <div style="font-size: 12px; color: #555;">
        <p>Pollo Pechugón Rosticerías Corp, C. Eca Do Queiros 5125, Jardines Universidad, 45110 Zapopan, Jalisco</p>
        <p>&copy; 2024 Pollo Pechugón Rosticerías. All rights reserved.</p>
      </div>
    </div>
  `;

  const attachments = eventSaved.attached.map(at => ({
    filename: at.fileName,
    path: at.url,
  }));

  await sendEmails([user.email], subject, htmlBody, attachments);
};

// Obtener todos los eventos con filtro opcional por mes y año
eventoCtrl.getAllEventos = async (req, res) => {
  try {
    const { month, year } = req.query; 
    const filter = { activo: 1 };

    if (month) {
      // Si no se proporciona un año, usa el actual
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

// Obtener un evento por su ID
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

// Editar información de evento mediante su ID
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
    const attachedFiles = req.files
      ? req.files.map((file) => ({
        fileName: file.originalname, 
        url: file.location,         
      }))
      : [];

    const evento = await Evento.findById(id);
    if (!evento) {
      return res.status(404).json({ mensaje: 'Evento no encontrado' });
    }

    updatedData.userUpd = userUpd;
    updatedData.attached = [...(updatedData.attached || []), ...attachedFiles];

    const eventUpdated = await Evento.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    if (eventUpdated.emails && eventUpdated.emails.length > 0) {
      await sendInvitationsEmails(eventUpdated, true);
      await Evento.updateOne(
        { _id: eventUpdated._id }, 
        {
          $set: { "emails.$[].emailSent": true }, 
        }
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

// Eliminar un evento mediante su ID (activo 0: se elimina de la vista)
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