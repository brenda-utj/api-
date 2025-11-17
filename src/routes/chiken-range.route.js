/**
 * ******************************
 *   POLLO PECHUGON ROSTICERIAS
 * ******************************
 * Author: Roberto Hurtado
 * Date: 12-12-2024
 * Description: Archivo de rutas para Rango Pollo
 */

const express = require('express');
const router = express.Router();
const permissions = require('../utils/permissions');
const chikenRanges = require('../controllers/chiken-ranges.controller');

// Obtener registros
router.post('/get', permissions.isLoggedIn, chikenRanges.get);

// Crear nuevos registros
router.post('/new', permissions.isLoggedIn, chikenRanges.create);

//Editar registros existentes
router.post('/edit/:id', permissions.isLoggedIn, chikenRanges.edit);

//Eliminar registros
router.post('/delete/:id', permissions.isLoggedIn, chikenRanges.delete);

module.exports = router;