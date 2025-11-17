const express = require('express');
const router = express.Router();
const subtiposController = require('../controllers/subtipos.controller');
const permissions = require('../utils/permissions');

router.get('/subtypes/:tipoId', permissions.isLoggedIn, subtiposController.obtenerSubtipos);
router.get('/subtypes-id/:id',permissions.isLoggedIn,  subtiposController.obtenerSubtipoPorId);
router.post('/create/:tipoId',permissions.isLoggedIn,subtiposController.crearSubtipo);
router.patch('/update/:id',permissions.isLoggedIn, subtiposController.actualizarSubtipo);
router.delete('/delete/:id',permissions.isLoggedIn,  subtiposController.eliminarSubtipo);
router.put('/modify/:id', permissions.isLoggedIn, subtiposController.modifyField); 

module.exports = router;