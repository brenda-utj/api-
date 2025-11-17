/**
 * ******************************
 *   POLLO PECHUGON ROSTICERIAS
 * ******************************
 * Author: Roberto Hurtado
 * Date: 31-12-2024
 * Description: Archivo de rutas para Remisiones
 */

const express = require('express');
const router = express.Router();
const permissions = require('../utils/permissions');
const referrals = require('../controllers/referrals.controller');

// Obtener registros
router.get('/get', permissions.isLoggedIn, referrals.get);

// Obtener por Id
router.get('/get/:id', permissions.isLoggedIn, referrals.getById);

// Crear nuevos registros
router.post('/new', permissions.isLoggedIn, referrals.create);

//Editar registros existentes
router.post('/edit/:id', permissions.isLoggedIn, referrals.edit);

//Eliminar registros
router.post('/delete/:id', permissions.isLoggedIn, referrals.delete);

module.exports = router;