const mongoose = require('mongoose');
const { Schema } = mongoose;

const ciudadesSchema = new Schema({
    nombre: String,
    estado: Schema.Types.ObjectId,
    activo: Number
}, {timestamps: true});

module.exports = mongoose.model('ciudades', ciudadesSchema);