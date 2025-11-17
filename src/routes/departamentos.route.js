const express = require("express");
const router = express.Router();
const departamentosController = require("../controllers/departamentos.controller");
const permissions = require("../utils/permissions");

// Obtener todos los departamentos activos
router.get("/get", permissions.isLoggedIn, departamentosController.getAllDepartamentos);

// Obtener un departamento por ID
router.get("/get/:id", permissions.isLoggedIn, departamentosController.getDepartamento);

// Crear un nuevo departamento
router.post("/create", permissions.isLoggedIn, departamentosController.createDepartamento);

// Actualizar un departamento
router.put("/:id", permissions.isLoggedIn, departamentosController.updateDepartamento);

// Eliminar (desactivar) un departamento
router.post("/:id", permissions.isLoggedIn, departamentosController.deleteDepartamento);

module.exports = router;