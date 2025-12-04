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
const path = require('path');

// Crear un nuevo evento
eventoCtrl.createEvent = async (req, res) => {
  try {
    const userAdd = await User.findById(req.params.userId);
    if (!userAdd) {
      return res.status(404).json({ mensaje: 'No se encontró al usuario' });
    }

    // VALIDAR HORARIOS
    const parseTime = (time) => {
      const [hourMin, modifier] = time.split(" ");
      let [h, m] = hourMin.split(":").map(Number);

      if (modifier === "PM" && h !== 12) h += 12;
      if (modifier === "AM" && h === 12) h = 0;

      return h * 60 + m;
    };

    const start = parseTime(req.body.startTime);
    const end = parseTime(req.body.endTime);

    console.log('startTime', req.body.startTime, start);
    console.log('endTime', req.body.endTime, end);

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

    const convertTo24h = (time) => {
      const [hourMin, modifier] = time.split(" ");
      let [h, m] = hourMin.split(":").map(Number);

      if (modifier === "PM" && h !== 12) h += 12;
      if (modifier === "AM" && h === 12) h = 0;

      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };

    req.body.startTime = convertTo24h(req.body.startTime);
    req.body.endTime = convertTo24h(req.body.endTime);

    // PROCESAR ARCHIVOS ADJUNTOS
    const attachedFiles = [];
    
    if (req.files && req.files.length > 0) {
      console.log(`Se subieron ${req.files.length} archivos`);
      
      req.files.forEach(file => {
        // Crear la URL relativa para acceder al archivo
        const fileUrl = `/uploads/${file.filename}`;
        
        attachedFiles.push({
          fileName: file.originalname, // Nombre original del archivo
          url: fileUrl // URL para acceder al archivo
        });
      });
      
      console.log('Archivos procesados:', attachedFiles);
    }

    // GUARDAR EVENTO
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
        console.log('Enviando correos...', req.body?.emails.map(({email}) => email + ', '));
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
    console.error('Error en createEvent:', error);
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un evento
eventoCtrl.updateEvento = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar el evento existente
    const existingEvent = await Evento.findById(id);
    if (!existingEvent) {
      return res.status(404).json({ mensaje: 'Evento no encontrado' });
    }

    // Mantener archivos existentes
    let attachedFiles = existingEvent.attached || [];

    // Si hay nuevos archivos, agregarlos
    if (req.files && req.files.length > 0) {
      console.log(`Se subieron ${req.files.length} archivos nuevos`);
      
      const newFiles = req.files.map(file => ({
        fileName: file.originalname,
        url: `/uploads/${file.filename}`
      }));

      attachedFiles = [...attachedFiles, ...newFiles];
      console.log('Archivos actualizados:', attachedFiles);
    }

    // Actualizar el evento
    const updatedEvent = await Evento.findByIdAndUpdate(
      id,
      {
        ...req.body,
        attached: attachedFiles
      },
      { new: true }
    );

    res.status(200).json(updatedEvent);

  } catch (error) {
    console.error('Error en updateEvento:', error);
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

// Obtener todos los eventos
eventoCtrl.getAllEventos = async (req, res) => {
  try {
    const { month, year, view } = req.query;

    // Vista actual: list | calendar → por defecto "list"
    const currentView = view === "calendar" ? "calendar" : "list";

    const filter = { activo: 1 };

    // Filtro por mes/año
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

    // Si la vista es CALENDAR: retorna todo sin filtrar por usuario
    if (currentView === "calendar") {
      const events = await Evento.find(filter);
      return res.status(200).json(events);
    }

    // Si la vista es LIST aplica la lógica por rol
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    // Rol super administrativo → ve todo
    if (user.role === "super administrativo") {
      const events = await Evento.find(filter);
      return res.status(200).json(events);
    }

    // Caso contrario: solo los eventos creados por el usuario
    const events = await Evento.find({
      ...filter,
      "userAdd._id": user._id,
    });

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

    // ==== Convertir AM/PM a 24h ====
    const convertTo24h = (time) => {
      if (!time) return time; // si no viene, respeta el valor actual
      const [hourMin, modifier] = time.split(" ");
      let [h, m] = hourMin.split(":").map(Number);

      if (modifier === "PM" && h !== 12) h += 12;
      if (modifier === "AM" && h === 12) h = 0;

      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };

    // ==== Limpiar campos vacíos ====
    const updatedData = req.body;
    for (let field in updatedData) {
      if (updatedData[field] === '' || updatedData[field] === null) {
        delete updatedData[field];
      }
    }

    // ==== Aplicar conversión solo si vienen en el body ====
    if (updatedData.startTime) {
      updatedData.startTime = convertTo24h(updatedData.startTime);
    }

    if (updatedData.endTime) {
      updatedData.endTime = convertTo24h(updatedData.endTime);
    }

    // ==== Tomar valores finales (body o actuales) ====
    const newDate = updatedData.date || event.date;
    const newStartTime = updatedData.startTime || event.startTime;
    const newEndTime = updatedData.endTime || event.endTime;

    // ==== Validación de horario ====
    const start = new Date(`${newDate}T${newStartTime}`);
    const end = new Date(`${newDate}T${newEndTime}`);

    if (start >= end) {
      return res.status(400).json({
        mensaje: "La hora de inicio debe ser menor que la hora de fin"
      });
    }

    // ==== Validar traslape (excluye el evento actual) ====
    const overlappingEvent = await Evento.findOne({
      _id: { $ne: eventId },
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

    // ==== Guardar ====
    const eventUpdated = await Evento.findByIdAndUpdate(
      eventId,
      updatedData,
      { new: true }
    );

    // ==== Reenvío de correos ====
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
