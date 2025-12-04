const express = require('express');
const router = express.Router();
const reportsCtrl = require('../controllers/report.controller');
const permissions = require('../utils/permissions');
const upload = require('../config/multer');


// ✅ Obtener todas las notas (de todos los eventos)
router.get('/', permissions.isLoggedIn, reportsCtrl.getAllMyReports);

// Operaciones sobre EVENTOS
router.post('/event/:eventId', permissions.isLoggedIn, upload.array('files', 5), reportsCtrl.createReport);
router.get('/event/:eventId', permissions.isLoggedIn, reportsCtrl.getReportsForEvent);

// Operaciones sobre NOTAS INDIVIDUALES (por ID de nota)
router.get('/report/:id', permissions.isLoggedIn, reportsCtrl.getReportById);
router.put('/report/:id', permissions.isLoggedIn, upload.array('files', 5), reportsCtrl.updateReport);
router.delete('/report/:id', permissions.isLoggedIn, reportsCtrl.deleteReport);

module.exports = router;