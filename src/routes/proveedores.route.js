const express = require('express');
const router = express.Router();
const proveedor = require('../controllers/proveedores.controller');
const permissions = require('../utils/permissions');

// const multer = require('multer');

// const storage = multer.memoryStorage(); // Almacena el archivo en memoria
// const upload = multer({ storage: storage });

// router.post('/new', upload.single('constancy'), proveedor.create);
router.post('/new/:userId', permissions.isLoggedIn, proveedor.create);
router.post('/edit/:id/:userId', permissions.isLoggedIn, proveedor.edit);
router.post('/delete/:id/:userId', permissions.isLoggedIn, proveedor.delete);
router.get('/get', permissions.isLoggedIn, proveedor.get);

module.exports = router;