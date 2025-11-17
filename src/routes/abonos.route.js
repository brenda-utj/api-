const express = require('express');
const router = express.Router();

const abonos = require('../controllers/abonos.controller');
const permissions = require('../utils/permissions');

router.get('/get', permissions.isLoggedIn, abonos.get);
router.post('/get-all', permissions.isLoggedIn, abonos.getAllAbonos);
router.get('/get-id/:id', permissions.isLoggedIn, abonos.getAbonosById);
router.get('/get-monto-id/:id', permissions.isLoggedIn, abonos.getMontoAbonosId);
router.post('/new', permissions.isLoggedIn, abonos.create);
router.post('/edit/:id', permissions.isLoggedIn, abonos.edit);
router.post('/delete/:id', permissions.isLoggedIn, abonos.delete);


module.exports = router;