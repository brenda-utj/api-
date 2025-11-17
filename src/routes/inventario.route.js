const express = require('express');
const router = express.Router();
const inventario = require('../controllers/inventario.controller');
const permissions = require('../utils/permissions');

router.get('/sucursal', permissions.isLoggedIn, inventario.getInventario);
router.get('/movimientos/:id/:type/:sucursal', permissions.isLoggedIn, inventario.getMovimientosByInventario); // en type vas a mandar la palabra producto o materia para diferenciarlos
router.get('/all/:sucursal', permissions.isLoggedIn, inventario.getBySuc);
router.get('/all/:sucursal/:type', permissions.isLoggedIn, inventario.getBySucAndType);
router.get('/oneByProductAndSuc/:product/:sucursal', permissions.isLoggedIn, inventario.getInventarioByProductAndSuc);
router.get('/oneByMateriaAndSuc/:materia/:sucursal', permissions.isLoggedIn, inventario.getInventarioByMateriaAndSuc);
router.get('/addMateria/:id/:cantidad/:date', permissions.isLoggedIn, inventario.addMateria);
router.get('/menu', permissions.isLoggedIn, inventario.getMenu);
router.get('/inventarioUpdate/:id/:sellPrice', permissions.isLoggedIn, inventario.updatePrice);
router.get('/production/:id/:cantidad/:date', permissions.isLoggedIn, inventario.production);
router.put('/inventario/:id', permissions.isLoggedIn, inventario.updateInventario);
router.put('/sub/materia/:id/:cantidad', permissions.isLoggedIn, inventario.subMateria);
router.put('/add/products/:id/:cantidad', permissions.isLoggedIn, inventario.AltaProducto);
router.put('/sub/products/:id/:cantidad', permissions.isLoggedIn, inventario.bajaProducto);
router.put('/acceptTraspaso/:id', permissions.isLoggedIn, inventario.acceptTraspaso);
router.put('/rejectTraspaso/:id', permissions.isLoggedIn, inventario.rejectTraspaso);
router.put('/rejectTraspasoSynced/:id', permissions.isLoggedIn, inventario.rejectTraspasoSynced);
router.put('/updateArea/:from/:to', permissions.isLoggedIn, inventario.updateArea);
router.put('/registrarMerma/:id/:cantidad', permissions.isLoggedIn, inventario.registrarMerma);
router.post('/sync', permissions.isLoggedIn, inventario.sync);
router.get('/devolucion/:id/:cantidad/:date', permissions.isLoggedIn, inventario.devolucionMateria);
// router.delete('/:id', permissions.isLoggedIn, inventario.deleteInventario);
router.put('/:id/:user', permissions.isLoggedIn, inventario.deleteInventario);

module.exports = router;
