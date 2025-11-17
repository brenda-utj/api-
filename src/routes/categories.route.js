const express = require('express');
const router = express.Router();
const category = require('../controllers/category.controller');
const permissions = require('../utils/permissions');

router.post('/category/new/:user', permissions.isLoggedIn, category.createCategory);
router.get('/category/all', permissions.isLoggedIn, category.getCategories);
router.post('/unidad/new/:user', permissions.isLoggedIn, category.createUnidad);
router.get('/unidad/all', permissions.isLoggedIn, category.getUnidades);
router.get('/one/:id', permissions.isLoggedIn, category.getCategory);
router.put('/category/:id/:user', permissions.isLoggedIn, category.updateCategory);
router.put('/unidad/:id/:user', permissions.isLoggedIn, category.updateUnidad);
router.delete('/category/:id/:user', permissions.isLoggedIn, category.deleteCategory);
router.delete('/unidad/:id/:user', permissions.isLoggedIn, category.deleteUnidad);

module.exports = router;