const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/name.controller');
const permissions = require('../utils/permissions');

router.get('/', permissions.isLoggedIn, ctrl.all);

router.post('/', permissions.isLoggedIn, permissions.fifthLevel, ctrl.create);
router.put('/:id', permissions.isLoggedIn, permissions.fifthLevel, ctrl.update);
router.delete('/:id', permissions.isLoggedIn, permissions.fifthLevel, ctrl.delete);

module.exports = router;