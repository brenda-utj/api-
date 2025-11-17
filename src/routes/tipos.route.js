const express = require('express');
const router = express.Router();
const tiposController = require('../controllers/tipos.controller');
const permissions = require('../utils/permissions');

router.get('/types',permissions.isLoggedIn, tiposController.obtenerTipos);
router.post('/create',permissions.isLoggedIn,tiposController.crearTipo);
router.patch('/update/:id',permissions.isLoggedIn,  tiposController.actualizarTipo);
router.delete('/delete/:id',permissions.isLoggedIn, tiposController.eliminarTipo);
router.put('/modify/:id', permissions.isLoggedIn, tiposController.modifyField); 

module.exports = router;