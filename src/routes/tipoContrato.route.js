const express = require('express');
const router = express.Router();

const tipoContrato = require('../controllers/tipoContrato.controller');
const permissions = require('../utils/permissions');

router.get('/get',permissions.isLoggedIn,tipoContrato.get);
router.post('/new/:userId',permissions.isLoggedIn, tipoContrato.create);
router.post('/edit/:id/:userId',permissions.isLoggedIn, tipoContrato.edit);
router.delete('/delete/:id/:userId',permissions.isLoggedIn, tipoContrato.delete);

module.exports = router;