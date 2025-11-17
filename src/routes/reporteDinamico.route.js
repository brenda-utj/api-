const express = require('express');
const router = express.Router();
const reporteDinamico = require('../controllers/reporteDinamico.controller');

const permissions = require('../utils/permissions');

//método principal
router.post('/reporte-dinamico', permissions.isLoggedIn, reporteDinamico.reporteDinamico);

router.get('/get-collections', permissions.isLoggedIn, reporteDinamico.getCollections);
router.get('/get-config-collections', permissions.isLoggedIn, reporteDinamico.getConfigCollections);
router.post('/get-fields', permissions.isLoggedIn, reporteDinamico.getFields);
router.get('/update-config', permissions.isLoggedIn, reporteDinamico.updateConfig);
router.get('/update-doc/:nombreColeccion', permissions.isLoggedIn, reporteDinamico.updateDocument);
router.post( '/update/:id/:activo', permissions.isLoggedIn, reporteDinamico.update);
router.get( '/get-rep-dinamico/:nombreColeccion', permissions.isLoggedIn, reporteDinamico.getReporteDinamico);
router.get('/get-documentos-coleccion/:nombreColeccion', permissions.isLoggedIn, reporteDinamico.getDocumentosColeccion);
router.get('/get-hidden-fields/:collection', permissions.isLoggedIn, reporteDinamico.getHiddenFields);

module.exports = router;