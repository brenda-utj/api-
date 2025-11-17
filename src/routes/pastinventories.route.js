const express = require('express');
const router = express.Router();
const inventariopasado = require('../controllers/pastinventories.controller');
const permissions = require('../utils/permissions');

router.get('/all/:zona/:sucursal/:datefrom/:dateto', permissions.isLoggedIn, inventariopasado.getInventariosPasados);
router.post('/new', permissions.isLoggedIn,  inventariopasado.addInventariosPasados)
router.get('/report/:zona/:datefrom/:dateto/:product', permissions.isLoggedIn, inventariopasado.getReport)

module.exports = router;