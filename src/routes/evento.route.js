const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/evento.controller');
const permissions = require('../utils/permissions');
const upload = require('../config/multer');


// Crear un nuevo evento
//router.post('/new/:userId', permissions.isLoggedIn, eventoController.createEvent);
router.post('/new/:userId', permissions.isLoggedIn, upload.array('files', 5), eventoController.createEvent);

// Obtener todos los eventos 
//router.get('/all', permissions.isLoggedIn, eventoController.getAllEventos);
router.get('/all', permissions.isLoggedIn, eventoController.getAllEventos);

// Obtener un evento por su ID
//router.get('/:id', permissions.isLoggedIn, eventoController.getEventoById);
router.get('/:id', permissions.isLoggedIn, eventoController.getEventoById);

// Actualizar un evento
//router.put('/update/:id', permissions.isLoggedIn, eventoController.updateEvento);
router.put('/update/:id', permissions.isLoggedIn, upload.array('files', 5), eventoController.updateEvento);

//Eliminar un evento (activo 0)
//router.delete('/delete/:id', permissions.isLoggedIn, eventoController.deleteEvento);
router.delete('/delete/:id', eventoController.deleteEvento);


module.exports = router;
