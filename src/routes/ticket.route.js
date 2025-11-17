const express = require("express");
const router = express.Router();
const ticketsController = require("../controllers/ticket.controller");
const permissions = require("../utils/permissions");

// Obtener todos los tickets activos
router.get("/get", permissions.isLoggedIn, ticketsController.getAllTickets);

// Obtener un ticket por ID
router.get("/get/:id", permissions.isLoggedIn, ticketsController.getTicketById);

// Obtener los tickets asignados o que creó un usuario
router.get("/get-ticket-user/:id", permissions.isLoggedIn, ticketsController.getTicketsUser);

// Crear un nuevo ticket
router.post("/create", permissions.isLoggedIn, ticketsController.createTicket);

// Actualizar un ticket
router.put("/update/:id", permissions.isLoggedIn, ticketsController.updateTicket);

// Eliminar (desactivar) un ticket
router.post("/delete/:id", permissions.isLoggedIn, ticketsController.deleteTicket);

//Añadir un comentario al ticket
router.post('/comment/:id', permissions.isLoggedIn, ticketsController.addComment);

router.post('/notification/add/:ticketId', permissions.isLoggedIn, ticketsController.addNotification);

router.put('/notification/read/:notifId/:ticketId', permissions.isLoggedIn, ticketsController.markNotificationAsRead);

module.exports = router;