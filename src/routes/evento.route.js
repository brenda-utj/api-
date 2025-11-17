const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/evento.controller');
const permissions = require('../utils/permissions');
const upload = require('../utils/file-upload');



// Crear un nuevo evento
router.post('/new/:userId', permissions.isLoggedIn,  upload.array('files', 10), eventoController.createEvent);

// Obtener todos los eventos 
router.get('/all', permissions.isLoggedIn, eventoController.getAllEventos);

// Obtener un evento por su ID
router.get('/:id', permissions.isLoggedIn, eventoController.getEventoById);

// Actualizar un evento
router.put('/update/:id/:userId', permissions.isLoggedIn, upload.array('files', 10),  eventoController.updateEvento);

//Eliminar un evento (activo 0)
router.delete('/delete/:id/:userId', permissions.isLoggedIn, eventoController.deleteEvento);


module.exports = router;
