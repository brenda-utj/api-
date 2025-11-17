const express = require('express');
const router = express.Router();
const modificacion = require('../controllers/modificacion.controller');
const permissions = require('../utils/permissions');

router.get('/all/:sucursal', permissions.isLoggedIn, modificacion.getSucursalModificaciones);

module.exports = router;