const express = require('express');
const router = express.Router();
const caja = require('../controllers/caja.controller');
const permissions = require('../utils/permissions');

router.get('/current/:id', permissions.isLoggedIn, caja.getCaja);
router.get('/recurrentes', permissions.isLoggedIn, caja.getRecurrentes);
router.put('/recurrente/:id', permissions.isLoggedIn, caja.editRecurrente);
router.delete('/recurrente/:id', permissions.isLoggedIn, caja.deleteRecurrente);
router.post('/recurrente/new', permissions.isLoggedIn, caja.createRecurrente);
router.put('/cobrarCredito/:id', permissions.isLoggedIn, caja.updateCredito);
router.get('/creditos/:sucursal', permissions.isLoggedIn, caja.getCreditos);
router.post('/credito', permissions.isLoggedIn, caja.crearCredito);
router.put('/add/:id', permissions.isLoggedIn, caja.ingresarDinero);
router.put('/subs/:id', permissions.isLoggedIn, caja.retirarDinero);
router.put('/update/:id', permissions.isLoggedIn, caja.updateCaja);
router.get('/report/:sucursal', permissions.isLoggedIn, caja.reporte);

//remover duplicados
//router.get('/movs/:sucursal/:pos', permissions.isLoggedIn, caja.getMovsPos);
//router.get('/removeMov/:id', permissions.isLoggedIn, caja.removeMov);

module.exports = router;