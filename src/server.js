const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");
require("dotenv").config();
const connectDB = require("./database");

const app = express();
const server = http.createServer(app);

// Conexión BD
connectDB();

const { initSocket } = require("./socket");
const io = initSocket(server);

app.use((req, res, next) => {
  req.io = io;
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
app.use("/api/events", require("./routes/evento.route"));
app.use("/api/map", require("./routes/map.route"));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

server.listen(app.get("port"), () => {
  console.log("server on port", app.get("port"));
});
