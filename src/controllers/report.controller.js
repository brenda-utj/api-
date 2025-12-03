const Report = require('../models/report.model');
const Evento = require('../models/evento.model');
const mongoose = require('mongoose');

const reportsCtrl = {};

// Helpers de validación simples
const validateAttachments = (attachments) => {
  if (!Array.isArray(attachments)) return false;
  for (const a of attachments) {
    if (!a.filename || !a.url) return false;
  }
  return true;
};

// Crear nota 
reportsCtrl.createReport = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    const { eventId } = req.params;
    const { content, attachments } = req.body;

    // validaciones básicas
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: 'eventId inválido' });
    }
    const event = await Evento.findById(eventId);
    if (!event || !event.activo) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return res.status(400).json({ message: 'El contenido de la nota es obligatorio' });
    }
    if (content.length > 2000) {
      return res.status(400).json({ message: 'El contenido excede el máximo permitido (2000)' });
    }

    if (attachments && !validateAttachments(attachments)) {
      return res.status(400).json({ message: 'Adjuntos con formato inválido' });
    }

    const report = new Report({
      userId,
      eventId,
      content: content.trim(),
      attachments: attachments || []
    });

    const saved = await report.save();
    return res.status(201).json(saved);

  } catch (err) {
    console.error("createReport error:", err);
    return res.status(500).json({ message: err.message });
  }
};

// Obtener notas del usuario para un evento (solo las del req.user)
reportsCtrl.getReportsForEvent = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: 'eventId inválido' });
    }

    const reports = await Report.find({ eventId, userId, active: true }).sort({ createdAt: -1 });
    return res.json(reports);
  } catch (err) {
    console.error("getReportsForEvent error:", err);
    return res.status(500).json({ message: err.message });
  }
};

// Obtener todas las notas del usuario en todos los eventos
reportsCtrl.getAllMyReports = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    const reports = await Report.find({ userId, active: true }).sort({ createdAt: -1 });
    return res.json(reports);
  } catch (err) {
    console.error("getAllMyReports error:", err);
    return res.status(500).json({ message: err.message });
  }
};

// Obtener nota por ID (solo dueño)
reportsCtrl.getReportById = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    const reportId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(reportId)) {
      return res.status(400).json({ message: 'report id inválido' });
    }

    const report = await Report.findById(reportId);

    if (!report || !report.active) {
      return res.status(404).json({ message: 'Nota no encontrada' });
    }

    if (report.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'No tienes permiso para ver esta nota' });
    }

    return res.status(200).json(report);

  } catch (err) {
    console.error("getReportById error:", err);
    return res.status(500).json({ message: err.message });
  }
};

// Actualizar nota 
reportsCtrl.updateReport = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    const reportId = req.params.id;
    const { content, attachments } = req.body;

    if (!mongoose.Types.ObjectId.isValid(reportId)) {
      return res.status(400).json({ message: 'report id inválido' });
    }

    const report = await Report.findById(reportId);
    if (!report || !report.active) return res.status(404).json({ message: 'Nota no encontrada' });

    if (report.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'No tienes permiso para editar esta nota' });
    }

    // validaciones
    if (content !== undefined) {
      if (!content || typeof content !== 'string' || content.trim().length === 0) {
        return res.status(400).json({ message: 'El contenido de la nota es obligatorio' });
      }
      if (content.length > 2000) return res.status(400).json({ message: 'El contenido excede el máximo permitido (2000)' });
      report.content = content.trim();
    }

    if (attachments !== undefined) {
      if (!validateAttachments(attachments)) return res.status(400).json({ message: 'Adjuntos con formato inválido' });
      report.attachments = attachments;
    }

    report.updatedAt = new Date();
    const saved = await report.save();
    return res.json(saved);

  } catch (err) {
    console.error("updateReport error:", err);
    return res.status(500).json({ message: err.message });
  }
};

// Eliminar nota (soft delete) (solo dueño)
reportsCtrl.deleteReport = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    const reportId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(reportId)) return res.status(400).json({ message: 'report id inválido' });

    const report = await Report.findById(reportId);
    if (!report || !report.active) return res.status(404).json({ message: 'Nota no encontrada' });

    if (report.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar esta nota' });
    }

    report.active = false;
    await report.save();

    return res.json({ message: 'Nota eliminada correctamente' });
  } catch (err) {
    console.error("deleteReport error:", err);
    return res.status(500).json({ message: err.message });
  }
};

module.exports = reportsCtrl;
