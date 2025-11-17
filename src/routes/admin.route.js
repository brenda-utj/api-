const express = require('express');
const router = express.Router();
const admin = require('../controllers/admin.controller');
const permissions = require('../utils/permissions');

router.get('/deleteAll', permissions.isLoggedIn, permissions.fifthLevel, admin.deleteAll);
router.get('/resetOperations', permissions.isLoggedIn, permissions.fifthLevel, admin.resetOperations);
router.get('/identities/:userid', permissions.isLoggedIn, admin.getIdentities)
router.delete('/identity/:id', permissions.isLoggedIn, admin.deleteIdentitie);

module.exports = router;
