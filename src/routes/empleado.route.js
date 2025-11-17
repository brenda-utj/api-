const express = require('express');
const router = express.Router();

const empleado = require('../controllers/empleado.controller');
const permissions = require('../utils/permissions');


router.post('/new', permissions.isLoggedIn, empleado.createEmpleado);
router.get('/all/:by/:id', permissions.isLoggedIn, empleado.getEmpleados);
router.put('/updated/:id', permissions.isLoggedIn, permissions.firstLevel, empleado.updateEmpleado);
router.delete('/delete/:id', permissions.isLoggedIn, empleado.deleteEmpleado);
router.put('/deuda/:id', permissions.isLoggedIn, empleado.agregarDeuda);
router.put('/abono/:id', permissions.isLoggedIn, empleado.agregarAbono);

module.exports = router;