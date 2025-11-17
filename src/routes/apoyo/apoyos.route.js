const express = require('express');
const router = express.Router();
const apoyos = require('../../controllers/apoyo/apoyos.controller');
const permissions = require('../../utils/permissions');

router.post('/new/:userId', apoyos.create);
router.post('/edit/:id/:userId', apoyos.edit);
router.post('/delete/:id/:userId', apoyos.delete);
//router.post('/recibir-apoyo', apoyos.recibirApoyo);
router.post('/check/:date/:date_to', apoyos.check);
router.post('/check-sin-visto/:date/:date_to', apoyos.checkSinVisto);
router.post('/ingresar-apoyo', apoyos.ingresarApoyos);
router.post('/ingresar-apoyo-todo', apoyos.ingresarApoyosTodo);
router.post('/marcar-visto/:sucursal', apoyos.marcarVisto);
router.post('/marcar-doble/:sucursal', apoyos.marcarDobleVisto);
router.post('/marcar-doble-todo/:sucursal', apoyos.marcarDobleVistoTodo);

module.exports = router;
