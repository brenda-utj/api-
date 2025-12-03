const express = require("express");
const router = express.Router();
const modulos = require("../controllers/modulos.controller");
const permissions = require('../utils/permissions');

router.post('/new', modulos.create);
router.post('/update/:id', modulos.update);
router.post('/update-view/:id', modulos.updateView);
router.post('/delete/:id', modulos.delete);
router.get('/get-all', modulos.getAll);

module.exports = router;