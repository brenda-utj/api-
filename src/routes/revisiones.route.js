const express = require('express');
const router = express.Router();
const revision = require('../controllers/revisiones.controller');
const permissions = require('../utils/permissions');


router.post('/new', revision.create);
router.get('/report/:zona_id/:datefrom/:dateto/:usuario', permissions.isLoggedIn, revision.report);
router.get('/report-new/:zona_id/:datefrom/:dateto/:usuario', permissions.isLoggedIn, revision.reportNew);


module.exports = router;