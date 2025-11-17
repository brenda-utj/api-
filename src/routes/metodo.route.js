const express = require('express');
const router = express.Router();

const metodos = require('../controllers/metodo.controller');
const permissions = require('../utils/permissions');

router.post('/new', permissions.isLoggedIn, metodos.createMetodo);
router.get('/all', permissions.isLoggedIn, metodos.getMetodos);
router.put('/update/:id', permissions.isLoggedIn, metodos.updateMetodo);
router.delete('/:id', permissions.isLoggedIn, metodos.deleteMetodo);

module.exports = router;
