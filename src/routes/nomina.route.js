const express = require('express');
const router = express.Router();

const nomina = require('../controllers/nomina.controller');
const permissions = require('../utils/permissions');


router.post('/new', permissions.isLoggedIn, nomina.createNomina);
router.get('/all/:by/:id', permissions.isLoggedIn, nomina.getNominas);
router.get('/sucursal/:id', permissions.isLoggedIn, nomina.getNominasSucursal);
router.put('/pagar/:id',permissions.isLoggedIn, nomina.pagar);
router.post('/pagar-adm/:id/:user',permissions.isLoggedIn, nomina.pagarAdm);
//router.put('/:id',permissions.isLoggedIn,nomina.updateNomina);
router.put('/:id', nomina.updateNomina);

module.exports = router;