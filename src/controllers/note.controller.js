const Note = require('../models/note.model');
const Evento = require('../models/evento.model');
const mongoose = require('mongoose');

const notesCtrl = {};

// Helpers de validación simples
const validateAttachments = (attachments) => {
  if (!Array.isArray(attachments)) return false;
  for (const a of attachments) {
    if (!a.filename || !a.url) return false;
  }
  return true;
};

// Crear nota (req.user viene del middleware)
notesCtrl.createNote = async (req, res) => {
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

    const note = new Note({
      userId,
      eventId,
      content: content.trim(),
      attachments: attachments || []
    });

    const saved = await note.save();
    return res.status(201).json(saved);

  } catch (err) {
    console.error("createNote error:", err);
    return res.status(500).json({ message: err.message });
  }
};

// Obtener notas del usuario para un evento (solo las del req.user)
notesCtrl.getNotesForEvent = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: 'eventId inválido' });
    }

    const notes = await Note.find({ eventId, userId, active: true }).sort({ createdAt: -1 });
    return res.json(notes);
  } catch (err) {
    console.error("getNotesForEvent error:", err);
    return res.status(500).json({ message: err.message });
  }
};

// Obtener todas las notas del usuario en todos los eventos
notesCtrl.getAllMyNotes = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    const notes = await Note.find({ userId, active: true }).sort({ createdAt: -1 });
    return res.json(notes);
  } catch (err) {
    console.error("getAllMyNotes error:", err);
    return res.status(500).json({ message: err.message });
  }
};

// Obtener nota por ID (solo dueño)
notesCtrl.getNoteById = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    const noteId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return res.status(400).json({ message: 'note id inválido' });
    }

    const note = await Note.findById(noteId);

    if (!note || !note.active) {
      return res.status(404).json({ message: 'Nota no encontrada' });
    }

    if (note.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'No tienes permiso para ver esta nota' });
    }

    return res.status(200).json(note);

  } catch (err) {
    console.error("getNoteById error:", err);
    return res.status(500).json({ message: err.message });
  }
};

// Actualizar nota 
notesCtrl.updateNote = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    const noteId = req.params.id;
    const { content, attachments } = req.body;

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return res.status(400).json({ message: 'note id inválido' });
    }

    const note = await Note.findById(noteId);
    if (!note || !note.active) return res.status(404).json({ message: 'Nota no encontrada' });

    if (note.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'No tienes permiso para editar esta nota' });
    }

    // validaciones
    if (content !== undefined) {
      if (!content || typeof content !== 'string' || content.trim().length === 0) {
        return res.status(400).json({ message: 'El contenido de la nota es obligatorio' });
      }
      if (content.length > 2000) return res.status(400).json({ message: 'El contenido excede el máximo permitido (2000)' });
      note.content = content.trim();
    }

    if (attachments !== undefined) {
      if (!validateAttachments(attachments)) return res.status(400).json({ message: 'Adjuntos con formato inválido' });
      note.attachments = attachments;
    }

    note.updatedAt = new Date();
    const saved = await note.save();
    return res.json(saved);

  } catch (err) {
    console.error("updateNote error:", err);
    return res.status(500).json({ message: err.message });
  }
};

// Eliminar nota (soft delete) (solo dueño)
notesCtrl.deleteNote = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    const noteId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(noteId)) return res.status(400).json({ message: 'note id inválido' });

    const note = await Note.findById(noteId);
    if (!note || !note.active) return res.status(404).json({ message: 'Nota no encontrada' });

    if (note.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar esta nota' });
    }

    note.active = false;
    await note.save();

    return res.json({ message: 'Nota eliminada correctamente' });
  } catch (err) {
    console.error("deleteNote error:", err);
    return res.status(500).json({ message: err.message });
  }
};

module.exports = notesCtrl;
