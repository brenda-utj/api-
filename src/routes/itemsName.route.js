const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/itemName.controller');
const permissions = require('../utils/permissions');

router.get('/names',permissions.isLoggedIn, ctrl.getNames)

router.get('/', permissions.isLoggedIn, ctrl.all);
router.post('/', permissions.isLoggedIn, ctrl.create);
//router.put('/:id', permissions.isLoggedIn, permissions.fifthLevel, ctrl.update);
router.put('/modify/:id', permissions.isLoggedIn, ctrl.modifyField); 
router.delete('/:id', permissions.isLoggedIn, permissions.fifthLevel, ctrl.delete);

module.exports = router;