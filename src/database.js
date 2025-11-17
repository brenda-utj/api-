/* eslint-disable no-console */
const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const config = {
  url: process.env.MONGO_URI,
  //localUrl: 'mongodb://localhost:27017/pos',
  localUrl: 'mongodb+srv://bre21:<bdsd210394>@project9.hktbvwn.mongodb.net/?appName=project9'
};

async function connectDB() {
  try {
    await mongoose.connect(config.localUrl, { 
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout después de 5 segundos
      socketTimeoutMS: 45000,         // Cierra sockets después de 45 segundos
      family: 4                       // Fuerza IPv4
    });

    console.log('****************************************');
    console.log('               PECHU-API                ');
    console.log('BD online', config.localUrl);
    console.log('****************************************');
  } catch (err) {
    console.error('❌ Error al conectar a MongoDB:', err);
    process.exit(1); // Sale si hay error crítico
  }
}

connectDB();

module.exports = mongoose.connection;
