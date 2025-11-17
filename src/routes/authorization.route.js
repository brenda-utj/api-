const express = require('express');
const router = express.Router();
const aut = require('../controllers/authorization.controller')
const permissions = require('../utils/permissions');

router.get('/history/:zona/:datefrom/:dateto', permissions.isLoggedIn,  aut.getAuthorizations);

module.exports = router;