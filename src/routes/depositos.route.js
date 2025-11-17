/**
 *
 * Autor: Roberto Hurtado
 * Fecha: 04 de Diciembre del 2023
 * Descripcion: Archivo de rutas para modulo depositos
 *
 */

const express = require("express");
const router = express.Router();
const depositosController = require("../controllers/depositos.controller");
const permissions = require("../utils/permissions");

// //// //// //// //// //// //// //// //// //// //// //
// Obtiene los registros
// //// //// //// //// //// //// //// //// //// //// //
router.get("/get", permissions.isLoggedIn, depositosController.getAllDepositos);

// //// //// //// //// //// //// //// //// //// //// //
// Obtiene los registros con los filtros existentes
// //// //// //// //// //// //// //// //// //// //// //
router.get(
	"/getFiltered/:fechaInicial/:fechaFinal/:zona/:sucursal",
	permissions.isLoggedIn,
	depositosController.getDepositosFiltered
);

// //// //// //// //// //// //// //// //// //// //// //
// Obtiene un registro
// //// //// //// //// //// //// //// //// //// //// //
router.get(
	"/get/:dep_id",
	permissions.isLoggedIn,
	depositosController.getDeposito
);

// //// //// //// //// //// //// //// //// //// //// //
// Crea un registro
// //// //// //// //// //// //// //// //// //// //// //
router.post(
	"/create",
	permissions.isLoggedIn,
	depositosController.createDeposito
);

// //// //// //// //// //// //// //// //// //// //// //
// Actualiza un registro
// //// //// //// //// //// //// //// //// //// //// //
router.put(
	"/:dep_id",
	permissions.isLoggedIn,
	depositosController.updateDeposito
);

// //// //// //// //// //// //// //// //// //// //// //
// Elimina un registro
// //// //// //// //// //// //// //// //// //// //// //
router.delete(
	"/:dep_id/:user_id",
	permissions.isLoggedIn,
	depositosController.deleteDeposito
);

module.exports = router;
