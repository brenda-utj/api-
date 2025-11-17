const express = require('express');
const router = express.Router();

const menu = require('../controllers/menu.controller');
const permissions = require('../utils/permissions');

router.post('/new', permissions.isLoggedIn, menu.createItem);
router.get('/all/:id', permissions.isLoggedIn, menu.getItems);
router.get('/admin-all/:id', permissions.isLoggedIn, menu.getAllItems);
router.get('/one/:id', permissions.isLoggedIn, menu.getItem);
router.put('/update/:id', permissions.isLoggedIn, menu.updateItem);
router.put('/modify/:id', permissions.isLoggedIn, menu.modifyField); 
router.delete('/:id', permissions.isLoggedIn, menu.deleteItem);
router.delete('/all/:sucursal', permissions.isLoggedIn, menu.deleteAllItem);

router.post('/all-zona/:zona',permissions.isLoggedIn, menu.getItemsZona);

module.exports = router;