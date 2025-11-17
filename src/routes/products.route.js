const express = require('express');
const router = express.Router();
const products = require('../controllers/products.controller');
const permissions = require('../utils/permissions');

router.post('/materia/new/:user', permissions.isLoggedIn, permissions.firstLevel, products.createMateria);
router.post('/product/new/:user', permissions.isLoggedIn, permissions.firstLevel, products.createProduct);
// router.get('/materia/all/:src?', permissions.isLoggedIn, permissions.firstLevel, products.getMaterias);
// router.get('/product/all/:src?', permissions.isLoggedIn, permissions.firstLevel, products.getProducts);
router.get('/materia/all', permissions.isLoggedIn, permissions.firstLevel, products.getMaterias);
router.get('/materia/all/:src', permissions.isLoggedIn, permissions.firstLevel, products.getMaterias);
router.get('/product/all', permissions.isLoggedIn, permissions.firstLevel, products.getProducts);
router.get('/product/all/:src', permissions.isLoggedIn, permissions.firstLevel, products.getProducts);
router.get('/materia/one/:id', permissions.isLoggedIn, permissions.firstLevel, products.getMateria);
router.get('/product/one/:id', permissions.isLoggedIn, permissions.firstLevel, products.getProduct);
router.put('/materia/:id/:user', permissions.isLoggedIn, permissions.firstLevel, products.updateMateria);
router.put('/update-product/:id/:user', permissions.isLoggedIn, permissions.firstLevel, products.updateProduct);
router.put('/delete-materia/:id/:user', permissions.isLoggedIn, permissions.firstLevel, products.deleteMateria);
router.put('/delete-product/:id/:user', permissions.isLoggedIn, permissions.firstLevel, products.deleteProduct);

module.exports = router;
