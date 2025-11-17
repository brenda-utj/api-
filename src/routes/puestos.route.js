const express = require('express');
const router = express.Router();

const puesto = require('../controllers/puestos.controller');
const permissions = require('../utils/permissions');

router.get('/get',permissions.isLoggedIn,puesto.get);
router.post('/new/:userId',permissions.isLoggedIn, puesto.create);
router.post('/edit/:id/:userId',permissions.isLoggedIn, puesto.edit);
router.delete('/delete/:id/:userId',permissions.isLoggedIn, puesto.delete);

module.exports = router;