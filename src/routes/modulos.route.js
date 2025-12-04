const express = require("express");
const router = express.Router();
const modulos = require("../controllers/modulos.controller");
const permissions = require('../utils/permissions');

router.post('/new', permissions.isLoggedIn, modulos.create);
router.post('/update/:id', permissions.isLoggedIn, modulos.update);
router.post('/update-view/:id', permissions.isLoggedIn, modulos.updateView);
router.post('/delete/:id', permissions.isLoggedIn, modulos.delete);
router.get('/get-all', permissions.isLoggedIn, modulos.getAll);

module.exports = router;