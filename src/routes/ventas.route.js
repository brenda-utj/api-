const express = require('express');
const router = express.Router();
const ventas = require('../controllers/ventas.controller');
const permissions = require('../utils/permissions');

router.post('/new', permissions.isLoggedIn, ventas.venta);
router.post('/paquete', permissions.isLoggedIn, ventas.ventaPaquete);
router.get('/historia', permissions.isLoggedIn, ventas.getAllVentasHistoria);
router.get('/all', permissions.isLoggedIn, ventas.getAllVentas);
router.get('/one/:id', permissions.isLoggedIn, ventas.getVenta);
router.get('/movimientos/:sucursal/:producto', permissions.isLoggedIn, ventas.getVentasBySucAndProduct);
router.get('/porpaquete/:paquete', permissions.isLoggedIn, ventas.getVentasPaquete);
router.put('/cancel/:id', permissions.isLoggedIn, ventas.cancelVenta);

//remover duplicados
//router.get('/removeDuplicate/:sucursal/:inicial/:final', permissions.isLoggedIn, ventas.removeDuplicate);

module.exports = router;
