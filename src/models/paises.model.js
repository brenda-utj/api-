const mongoose = require('mongoose');
const { Schema } = mongoose;

const paisesSchema = new Schema({
    nombre: String,
    nombre_corto: String,
    activo: Number
}, {timestamps: true});

module.exports = mongoose.model('paises', paisesSchema);