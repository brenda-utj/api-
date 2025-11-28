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

    // VALIDAR HORARIOS
    const parseTime = (time) => {
      const [h, m] = time.split(":").map(Number);
      return h * 60 + m;
    };

    const start = parseTime(req.body.startTime);
    const end = parseTime(req.body.endTime);

    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ mensaje: "Formato de hora inválido" });
    }

    if (start >= end) {
      return res.status(400).json({
        mensaje: "La hora de inicio debe ser menor que la hora de fin"
      });
    }

    // VALIDAR TRASLAPE
    const date = new Date(req.body.date);

    const dayStart = new Date(date.setHours(0, 0, 0, 0));
    const dayEnd = new Date(date.setHours(23, 59, 59, 999));

    const eventsSameDay = await Evento.find({
      date: { $gte: dayStart, $lte: dayEnd },
      activo: 1
    });

    const overlaps = eventsSameDay.some(ev => {
      const evStart = parseTime(ev.startTime);
      const evEnd = parseTime(ev.endTime);

      return start < evEnd && end > evStart;
    });

    if (overlaps) {
      return res.status(400).json({
        mensaje: "Ya hay un evento registrado en ese horario"
      });
    }

    // GUARDAR EVENTO
    const attachedFiles = [];
    const newEvent = new Evento({
      ...req.body,
      attached: attachedFiles,
      userAdd,
      activo: 1,
    });

    const eventSaved = await newEvent.save();

    // RESPUESTA INMEDIATA
    res.status(201).json(eventSaved);

    // CORREOS EN SEGUNDO PLANO
    (async () => {
      try {
        if (req.body.emails && req.body.emails.length > 0) {
          await sendInvitationsEmails(eventSaved);
          await Evento.updateOne(
            { _id: eventSaved._id },
            { $set: { "emails.$[].emailSent": true } }
          );
        }
        await sendEmailToCreator(eventSaved);
      } catch (err) {
        console.error("Error al enviar correos:", err);
      }
    })();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Método para enviar correo a invitados
const sendInvitationsEmails = async (eventSaved, isUpdated = false) => {
  const emailsToSend = eventSaved.emails
    .filter(email => !email.emailSent)
    .map(email => email.email);

  const subject = isUpdated
    ? 'Actualización de evento'
    : 'Invitación para Evento';

  const googleMapsLink = `https://www.google.com/maps?q=${eventSaved.location.lat},${eventSaved.location.lng}`;

  const htmlBody = `
    <div>
      <h1>${eventSaved.name}</h1>
      <p><strong>Descripción:</strong> ${eventSaved.description}</p>
      <p><strong>Fecha:</strong> ${new Date(eventSaved.date).toLocaleDateString()}</p>
      <p><strong>Horario:</strong> ${formatTime(eventSaved.startTime)} - ${formatTime(eventSaved.endTime)}</p>
      <p><strong>Lugar:</strong> ${eventSaved.place}</p>
      <p><strong>Dirección:</strong> ${eventSaved.address}</p>
      <p><a href="${googleMapsLink}">Ver en mapa</a></p>
    </div>
  `;

  await sendEmails(emailsToSend, subject, htmlBody, []);
};

// Email para el creador del evento
const sendEmailToCreator = async (eventSaved) => {
  const subject = 'Creaste un nuevo evento';

  const htmlBody = `
    <div>
      <h1>Evento creado exitosamente</h1>
      <p><strong>Evento:</strong> ${eventSaved.name}</p>
      <p><strong>Fecha:</strong> ${new Date(eventSaved.date).toLocaleDateString()}</p>
      <p><strong>Horario:</strong> ${formatTime(eventSaved.startTime)} - ${formatTime(eventSaved.endTime)}</p>
    </div>
  `;

  await sendEmails([eventSaved.userAdd.email], subject, htmlBody, []);
};

//Obtener todos los eventos
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

  //Método para editar evento
  eventoCtrl.updateEvento = async (req, res) => {
    try {
      const eventId = req.params.id;
      const event = await Evento.findById(eventId);

      if (!event || !event.activo) {
        return res.status(404).json({ mensaje: 'Evento no encontrado' });
      }

      // Limpia campos vacíos
      const updatedData = req.body;
      for (let field in updatedData) {
        if (updatedData[field] === '' || updatedData[field] === null) {
          delete updatedData[field];
        }
      }

      const newDate = updatedData.date || event.date;
      const newStartTime = updatedData.startTime || event.startTime;
      const newEndTime = updatedData.endTime || event.endTime;
      const start = new Date(`${newDate}T${newStartTime}`);
      const end = new Date(`${newDate}T${newEndTime}`);

      if (start >= end) {
        return res.status(400).json({
          mensaje: "La hora de inicio debe ser menor que la hora de fin"
        });
      }

      // Buscar eventos en el mismo día que se empalmen, excluyendo el actual
      const overlappingEvent = await Evento.findOne({
        _id: { $ne: eventId },       // excluye este mismo evento
        activo: 1,
        date: newDate,
        $or: [
          {
            startTime: { $lt: newEndTime },
            endTime: { $gt: newStartTime }
          }
        ]
      });

      if (overlappingEvent) {
        return res.status(400).json({
          mensaje: "Ya hay un evento registrado en ese horario"
        });
      }
    
      // Actualizar evento
      const eventUpdated = await Evento.findByIdAndUpdate(
        eventId,
        updatedData,
        { new: true }
      );

      /** Enviar emails si hay invitados */
      if (eventUpdated.emails && eventUpdated.emails.length > 0) {
        await sendInvitationsEmails(eventUpdated, true);
        await Evento.updateOne(
          { _id: eventUpdated._id },
          { $set: { "emails.$[].emailSent": true } }
        );
      }

      res.status(200).json({
        mensaje: 'Evento actualizado con éxito',
        evento: eventUpdated
      });

    } catch (error) {
      console.error("Error en updateEvento:", error);
      res.status(500).json({ error: error.message });
    }
  };


//Método para eliminar evento
eventoCtrl.deleteEvento = async (req, res) => {
  try {
    const event = await Evento.findById(req.params.id);

    if (!event || !event.activo) {
      return res.status(404).json({ mensaje: 'Evento no encontrado' });
    }

    event.activo = 0;
    await event.save();

    res.status(200).json({
      mensaje: 'Evento eliminado con éxito',
      event
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = eventoCtrl;
