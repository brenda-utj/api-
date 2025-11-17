const express = require("express");
const router = express.Router();
const credenciales = require("../controllers/credenciales.controller");
const permissions = require('../utils/permissions');

router.post('/new', credenciales.create);
router.post('/update/:id', credenciales.update);
router.post('/delete/:id', credenciales.delete);
router.get('/get-all', credenciales.getAll);

module.exports = router;