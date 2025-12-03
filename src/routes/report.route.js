const express = require('express');
const router = express.Router();
const reportsCtrl = require('../controllers/report.controller');
const permissions = require('../utils/permissions');

// ✅ Obtener todas las notas (de todos los eventos)
router.get('/', permissions.isLoggedIn, reportsCtrl.getAllMyReports);

// Operaciones sobre EVENTOS
router.post('/event/:eventId', permissions.isLoggedIn, reportsCtrl.createReport);
router.get('/event/:eventId', permissions.isLoggedIn, reportsCtrl.getReportsForEvent);

// Operaciones sobre NOTAS INDIVIDUALES (por ID de nota)
router.get('/report/:id', permissions.isLoggedIn, reportsCtrl.getReportById);
router.put('/report/:id', permissions.isLoggedIn, reportsCtrl.updateReport);
router.delete('/report/:id', permissions.isLoggedIn, reportsCtrl.deleteReport);

module.exports = router;