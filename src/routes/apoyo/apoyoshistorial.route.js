const express = require('express');
const router = express.Router();
const apoyosHistorial = require('../../controllers/apoyo/apoyoshistorial.controller');
const permissions = require('../../utils/permissions');

router.post('/new', apoyosHistorial.create);
router.post('/new-all', apoyosHistorial.createAll);
router.post('/edit/:id/:userId', apoyosHistorial.edit);
router.post('/delete/:id/:userId', apoyosHistorial.delete);
router.post('/recibir-apoyo/:date/:date_to', apoyosHistorial.recibirApoyo);
router.post('/marcar-recibido/:id', apoyosHistorial.marcarRecibido);
router.get('/apoyos-realizados/:zona/:sucursal/:date/:date_to', apoyosHistorial.getApoyosRealizados);
router.get('/apoyos-recibidos/:zona/:sucursal/:date/:date_to', apoyosHistorial.getApoyosRecibidos);
router.post('/marcar-visto/:sucursal', apoyosHistorial.marcarVisto);
router.post('/marcar-doble/:sucursal', apoyosHistorial.marcarDobleVisto);
router.post('/check-sin-visto/:date/:date_to', apoyosHistorial.checkSinVisto);

module.exports = router;