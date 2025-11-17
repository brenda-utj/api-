const express = require('express');
const router = express.Router();
const movInv = require('../controllers/movinv.controller');
const permissions = require('../utils/permissions');

// router.get('/list/:id/:date', pos.list);
// router.get('/sales/:datefrom/:dateto/:zona/:sucursal', pos.sales);
// router.get('/one/:id', pos.one);
router.post('/new', movInv.create);

//remover duplicados 
//router.get('/removeDuplicate/:sucursal/:inicial/:final', permissions.isLoggedIn, movInv.removeDuplicate);

module.exports = router;