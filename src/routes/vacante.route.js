const express = require('express');
const router = express.Router();

const Vacante = require('../models/vacante.model'); 
const Puesto = require('../models/puestos.model'); 

const vacanteCtrl = require('../controllers/vacante.controller');
const permissions = require('../utils/permissions');

router.post('/new/:userId', permissions.isLoggedIn, permissions.sixthLevel, vacanteCtrl.createVacante);

router.get('/all', permissions.isLoggedIn, permissions.sixthLevel, vacanteCtrl.getVacantes);

router.get('/:id', permissions.isLoggedIn, permissions.sixthLevel, vacanteCtrl.getVacanteById);

router.put('/update/:id/:userId', permissions.isLoggedIn, permissions.sixthLevel, vacanteCtrl.updateVacante);

router.put('/status/:id/:userId', permissions.isLoggedIn, permissions.sixthLevel, vacanteCtrl.updateVacanteStatus);

router.delete('/delete/:id/:userId', permissions.isLoggedIn,  permissions.sixthLevel, vacanteCtrl.deleteVacante);

module.exports = router;
