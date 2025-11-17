const express = require('express');
const router = express.Router();
const prod = require('../controllers/prod.controller');
const permissions = require('../utils/permissions');

// router.get('/list/:id/:date', pos.list);
// router.get('/sales/:datefrom/:dateto/:zona/:sucursal', pos.sales);
// router.get('/one/:id', pos.one);
router.post('/new', permissions.isLoggedIn, prod.create);

module.exports = router;