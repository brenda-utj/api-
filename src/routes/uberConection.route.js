const express = require('express');
const router = express.Router();
const uberConection = require('../controllers/uberConection.controller')


router.post('/post', uberConection.prueba);

module.exports = router;