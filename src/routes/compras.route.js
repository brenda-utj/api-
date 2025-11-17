const express = require('express');
const router = express.Router();

const compras = require('../controllers/compras.controller');
const permissions = require('../utils/permissions');

router.get('/get', permissions.isLoggedIn, compras.get);
router.post('/get-range', permissions.isLoggedIn, compras.getByDate);
router.post('/new/:userId', permissions.isLoggedIn, compras.create);
router.post('/edit/:id/:userId', permissions.isLoggedIn, compras.edit);
router.post('/delete/:id/:userId', permissions.isLoggedIn, compras.delete);

module.exports = router;