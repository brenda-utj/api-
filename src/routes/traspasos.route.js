const express = require('express');
const router = express.Router();
const permissions = require('../utils/permissions');

const traspaso = require('../controllers/traspasos.controller');

router.post('/request', permissions.isLoggedIn, traspaso.requestTraspaso);
router.get('/myRequests/:sucursal', permissions.isLoggedIn, traspaso.getSolicitudes);
router.get('/myRejectedRequests/:sucursal', permissions.isLoggedIn, traspaso.getSolicitudesRechazadas);
router.get('/historial/:sucursal', permissions.isLoggedIn, traspaso.getHistorial);
router.post('/check', permissions.isLoggedIn, traspaso.reviewExistence);
router.get('/one/:id', permissions.isLoggedIn, traspaso.getTraspaso);

module.exports = router;