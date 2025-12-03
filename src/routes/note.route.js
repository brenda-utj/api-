const express = require('express');
const router = express.Router();
const notesCtrl = require('../controllers/note.controller');
const permissions = require('../utils/permissions');

//  Obtener todas las notas (de todos los eventos)
router.get('/', notesCtrl.getAllMyNotes);

// Operaciones sobre EVENTOS
router.post('/event/:eventId', notesCtrl.createNote);
router.get('/event/:eventId', notesCtrl.getNotesForEvent);

// Operaciones sobre NOTAS INDIVIDUALES (por ID de nota)
router.get('/note/:id', notesCtrl.getNoteById);
router.put('/note/:id', notesCtrl.updateNote);
router.delete('/note/:id', notesCtrl.deleteNote);

module.exports = router;