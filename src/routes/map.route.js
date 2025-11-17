const express = require('express');
const router = express.Router();
const mapCtrl = require('../controllers/map.controller');

router.get('/search', mapCtrl.search);

module.exports = router;
