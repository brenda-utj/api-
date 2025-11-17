const express = require('express');
const router = express.Router();

const tipoEmpleado = require('../controllers/tipoempleado.controller');
const permissions = require('../utils/permissions');

router.get('/get',permissions.isLoggedIn,tipoEmpleado.get);
router.post('/new/:userId',permissions.isLoggedIn, tipoEmpleado.create);
router.post('/edit/:id/:userId',permissions.isLoggedIn, tipoEmpleado.edit);
router.delete('/delete/:id/:userId',permissions.isLoggedIn, tipoEmpleado.delete);

module.exports = router;