const express = require('express');
const router = express.Router();

const alianzas = require('../controllers/alianzas.controller');
const permissions = require('../utils/permissions');

router.get('/get',permissions.isLoggedIn,alianzas.get);
router.post('/new/:userId',permissions.isLoggedIn, alianzas.create);
router.post('/edit/:id/:userId',permissions.isLoggedIn, alianzas.edit);
router.delete('/delete/:id/:userId',permissions.isLoggedIn, alianzas.delete);

module.exports = router;