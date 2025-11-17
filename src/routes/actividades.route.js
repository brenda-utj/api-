const express = require('express');
const router = express.Router();
const actividad = require('../controllers/actividades.controller')
const permissions = require('../utils/permissions');

router.post('/new/:userId', permissions.isLoggedIn, actividad.new);
router.get('/:tipo/:sucursal/:template', permissions.isLoggedIn, actividad.getLista)
router.put('/:id',permissions.isLoggedIn,actividad.updateLista)
router.get('/history/:type/:branch/:date', permissions.isLoggedIn, actividad.historyList)
router.get('/report/:zone/:user/:datefrom/:dateto/:tipo',permissions.isLoggedIn, actividad.report)
router.get('/resumen/:zone/:datefrom/:dateto',permissions.isLoggedIn, actividad.resume)

module.exports = router;