const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const http = require('http');
// const { initSocket } = require("./socket");
require("dotenv").config();

const app = express();
// Crear el servidor HTTP a partir de app
const server = http.createServer(app);

// Inicializar Socket.io aquí
// initSocket(server);
const { initSocket } = require("./socket");
const io = initSocket(server);

app.use((req, res, next) => {
  req.io = io; // Adjunta io al request
  next();
});

// Settings
app.set("port", process.env.PORT || 3000);

app.use(express.static(path.join(__dirname, "public"), { index: false }));

app.use(cors());
app.options("*", cors());
app.use(bodyParser.json({ limit: "25mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// routes
app.use("/api/users", require("./routes/user.route"));
// app.use("/api/locations", require("./routes/sucursales.route"));
// app.use("/api/products", require("./routes/products.route"));
// app.use("/api/inventarios", require("./routes/inventario.route"));
// app.use("/api/categories", require("./routes/categories.route"));
// app.use("/api/ventas", require("./routes/ventas.route"));
// app.use("/api/caja", require("./routes/caja.route"));
// app.use("/api/metodos", require("./routes/metodo.route"));
// app.use("/api/images", require("./routes/image.route"));
// app.use("/api/menu", require("./routes/menu.route"));
// app.use("/api/traspasos", require("./routes/traspasos.route"));
// app.use("/api/cupons", require("./routes/cupon.route"));
// app.use("/api/modificaciones", require("./routes/modificacion.route"));
// app.use("/api/admin", require("./routes/admin.route"));
// app.use("/api/pos", require("./routes/pos.route"));
// app.use("/api/prod", require("./routes/prod.route"));
// app.use("/api/movinv", require("./routes/movinv.route"));
// app.use("/api/names", require("./routes/name.route"));
// app.use("/api/empleados", require("./routes/empleado.route"));
// app.use("/api/nominas", require("./routes/nomina.route"));
// app.use("/api/web", require("./routes/webPage.route"));
// app.use("/api/uberConection", require("./routes/uberConection.route"));
// app.use("/api/opinion", require("./routes/opinion.route"));
// app.use("/api/authorization", require("./routes/authorization.route"));
// app.use("/api/inventariospasados", require("./routes/pastinventories.route"));
// app.use("/api/itemsName", require("./routes/itemsName.route"));
// app.use("/api/actividades", require("./routes/actividades.route"));
// app.use("/api/remisiones", require("./routes/remisiones.route"));
// app.use("/api/revisiones", require("./routes/revisiones.route"));
// app.use("/api/depositos", require("./routes/depositos.route"));
// app.use('/api/tipos', require('./routes/tipos.route'));
// app.use('/api/subtipos', require('./routes/subtipos.route'));
// app.use("/api/gastos", require("./routes/gastos.route"));
// app.use('/api/proveedores', require('./routes/proveedores.route'));
// app.use('/api/ciudades', require('./routes/ciudades.route'));
// app.use('/api/compras', require('./routes/compras.route'));
// app.use('/api/abonos', require('./routes/abonos.route'));
// app.use("/api/apoyos", require("./routes/apoyo/apoyos.route"));
// app.use("/api/apoyos-historial", require("./routes/apoyo/apoyoshistorial.route"));
// app.use("/api/activity-templates", require("./routes/activity-templates.route"));
// app.use("/api/tipoempleado", require("./routes/tipoempleado.route"));
// app.use("/api/puestos", require("./routes/puestos.route"));
// app.use("/api/alianzas", require("./routes/alianzas.route"));
// app.use("/api/tipo-contrato", require("./routes/tipoContrato.route"));
// app.use("/api/reporte-dinamico", require("./routes/reporteDinamico.route"));
// app.use("/api/vacante", require("./routes/vacante.route"));
// app.use("/api/chiken-ranges", require("./routes/chiken-range.route"));
// app.use("/api/referrals", require("./routes/referrals.route"));
// app.use("/api/departamentos", require("./routes/departamentos.route"));
// app.use("/api/ticket", require("./routes/ticket.route"));
// app.use("/api/modulos", require("./routes/modulos.route"));
// app.use("/api/credenciales", require("./routes/credenciales.route"));
app.use("/api/events", require("./routes/evento.route"));
app.use("/api/map", require("./routes/map.route"));

// start server
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "/public/index.html"));
});

server.listen(app.get("port"), () => {
	console.log("server on port ", app.get("port"));
});