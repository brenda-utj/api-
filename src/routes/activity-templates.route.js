/**
 * ******************************
 *   POLLO PECHUGON ROSTICERIAS
 * ******************************
 * Author: Roberto Hurtado
 * Date: 08-03-2024
 * Description: Archivo de rutas para Platillas Actividades
 */

const express = require('express');
const router = express.Router();
const permissions = require('../utils/permissions');
const activityTemplates = require('../controllers/activity-templates.controller');

// Obtener registros
router.get('/get', permissions.isLoggedIn, activityTemplates.get);

// Crear nuevos registros
router.post('/new/:userId', permissions.isLoggedIn, activityTemplates.create);

//Editar registros existentes
router.post('/edit/:id/:userId', permissions.isLoggedIn, activityTemplates.edit);

//Eliminar registros
router.post('/delete/:id/:userId', permissions.isLoggedIn, activityTemplates.delete);

//Habilitar / Deshabilitar template
router.post('/estatus/:id/:userId/:estatus', permissions.isLoggedIn, activityTemplates.changeStatus);

module.exports = router;