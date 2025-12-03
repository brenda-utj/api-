const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");
require("dotenv").config();
const connectDB = require("./database");

const app = express();
const server = http.createServer(app);

// =========================
//   CONEXIÓN A BASE DE DATOS
// =========================
connectDB();

// =========================
//       SOCKET.IO
// =========================
const { initSocket } = require("./socket");
const io = initSocket(server);
app.use((req, res, next) => {
  req.io = io;
  next();
});

// =========================
//        MIDDLEWARES
// =========================
app.use(cors());
app.options("*", cors());

// Aumentamos el límite para JSON grandes
app.use(bodyParser.json({ limit: "25mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// =========================
//     ARCHIVOS ESTÁTICOS
// =========================
// Evita el error ENOENT y carga correctamente `public`
const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));

// Log de seguridad
console.log("📁 Public path:", publicPath);

// =========================
//        RUTAS API
// =========================
app.use("/api/users", require("./routes/user.route"));
app.use("/api/events", require("./routes/evento.route"));
app.use("/api/notes", require("./routes/note.route"));
app.use("/api/map", require("./routes/map.route"));
app.use("/api/modulos", require("./routes/modulos.route"));


// =========================
//   FALLBACK DEL FRONTEND
// =========================
// Este fallback solo se aplica si existe index.html
app.get("*", (req, res, next) => {
  const indexPath = path.join(publicPath, "index.html");

  // Si la ruta empieza con /api, NO debe intentar devolver el frontend
  if (req.originalUrl.startsWith("/api")) {
    return res.status(404).json({ error: "Ruta API no encontrada" });
  }

  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error("❌ Error cargando index.html:", err.message);
      return res.status(500).send("No se pudo cargar el frontend");
    }
  });
});

// =========================
//       INICIAR SERVIDOR
// =========================
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
