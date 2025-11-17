const express = require('express');
const router = express.Router();
const cupon = require('../controllers/cupon.controller');
const permissions = require('../utils/permissions');

router.post('/cupon/new', permissions.isLoggedIn, cupon.crearCupon);
router.get('/cupons/:sucursal', permissions.isLoggedIn, cupon.getActiveCupones);
router.get('/flyers/:cupon', permissions.isLoggedIn, cupon.getCountFlyers);
router.post('/flyer/new', permissions.isLoggedIn, cupon.createFlyer);
router.put('/cupon/:id', permissions.isLoggedIn, cupon.updateCupon);

module.exports = router;
