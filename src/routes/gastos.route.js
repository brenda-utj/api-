const express = require('express');
const router = express.Router();
const gastos = require('../controllers/gastos.controller');
const permissions = require('../utils/permissions');

router.get('/get', permissions.isLoggedIn, gastos.obtener);
router.post('/get-range', permissions.isLoggedIn, gastos.obtenerRango);
router.post('/create/:userId', permissions.isLoggedIn, gastos.create);
router.post('/edit/:id/:userId', permissions.isLoggedIn, gastos.edit);
router.post('/delete/:id/:userId', permissions.isLoggedIn, gastos.delete);

module.exports = router;

