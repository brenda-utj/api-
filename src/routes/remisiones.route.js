const express = require('express');
const router = express.Router();
const remision = require('../controllers/remisiones.controller')
const permissions = require('../utils/permissions');

router.post('/new', remision.create);
router.get('/history/:type/:id/:datefrom/:dateto', permissions.isLoggedIn, remision.history);
router.get('/promedio/:sucursal', remision.obtenerPromedioTaco);
router.post('/val', remision.val);

module.exports = router;