/* eslint-disable no-console */
const mongoose = require("mongoose");
require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    });

    console.log("****************************************");
    console.log("               PECHU-API                ");
    //console.log("✔ BD conectada:", process.env.MONGO_URI);
    console.log("           ✔ BD conectada");
    console.log("****************************************");

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB desconectado. Intentando reconectar...");
    });

  } catch (err) {
    console.error("❌ Error al conectar a MongoDB:", err);
    process.exit(1);
  }
}

module.exports = connectDB;
