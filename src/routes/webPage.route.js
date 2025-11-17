const express = require('express');
const router = express.Router();
const webPage = require('../controllers/webPage.controller')

router.get('/sucursales/:zona', webPage.getSucursales);
router.get('/zonas/', webPage.getZonas);
router.post('/opinion/new', webPage.createOpinion);
router.post('/contactanos/new', webPage.contactanosMail);

module.exports = router;