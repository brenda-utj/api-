const express = require('express');
const router = express.Router();
const opinion = require('../controllers/opinion.controller');
const permissions = require('../utils/permissions');

router.post('/new', opinion.new);
router.get('/historial/:zona/:sucursal/:datefrom/:dateto', permissions.isLoggedIn, opinion.getAllOpinionHistoria);

module.exports = router;
