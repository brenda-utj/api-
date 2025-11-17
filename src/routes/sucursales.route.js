const express = require('express');
const router = express.Router();
const sucursales = require('../controllers/sucursales.controller');
const permissions = require('../utils/permissions');

router.post('/zona/new',permissions.isLoggedIn, sucursales.createZona);
router.post('/sucursal/new',permissions.isLoggedIn, sucursales.createSucursal);
router.get('/zonas/all', permissions.isLoggedIn, sucursales.getZona);
router.get('/alls', permissions.isLoggedIn, sucursales.getAllSucursales);
router.get('/all-populated', permissions.isLoggedIn, sucursales.getAllSucursalesPopulated);
router.get('/sucursales/one/:id', permissions.isLoggedIn, sucursales.getSucursal);
router.get('/zonas/user', permissions.isLoggedIn, sucursales.getZonasByUser);
router.get('/sucursales/all/:zona', permissions.isLoggedIn, sucursales.getSucursales);
router.put('/zonas/:id', permissions.isLoggedIn, sucursales.updateZona);
router.put('/sucursales/:id', permissions.isLoggedIn, sucursales.updateSucursal);
router.get('/get-zona-ind/:id', permissions.isLoggedIn, sucursales.getZonaInd);
router.get('/get-suc-ind/:id', permissions.isLoggedIn, sucursales.getSucursalInd);

module.exports = router;