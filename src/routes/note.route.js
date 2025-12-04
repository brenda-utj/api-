const express = require('express');
const router = express.Router();
const notesCtrl = require('../controllers/note.controller');
const permissions = require('../utils/permissions');
const upload = require('../config/multer');

//  Obtener todas las notas (de todos los eventos)
router.get('/', permissions.isLoggedIn, notesCtrl.getAllMyNotes);

// Operaciones sobre EVENTOS
router.post('/event/:eventId', permissions.isLoggedIn,  upload.array('files', 5), notesCtrl.createNote);
router.get('/event/:eventId', permissions.isLoggedIn, notesCtrl.getNotesForEvent);

// Operaciones sobre NOTAS INDIVIDUALES (por ID de nota)
router.get('/note/:id', permissions.isLoggedIn, notesCtrl.getNoteById);
router.put('/note/:id', permissions.isLoggedIn, upload.array('files', 5), notesCtrl.updateNote);
router.delete('/note/:id', permissions.isLoggedIn, notesCtrl.deleteNote);

module.exports = router;