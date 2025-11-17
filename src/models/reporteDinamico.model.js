const mongoose = require('mongoose');
const { Schema } = mongoose;

const reporteDinSchema = new Schema({
    nombreColeccion: String,
    configuracion: { },
    activo: Boolean
}, {timestamps: true});

module.exports = mongoose.model('reportesdinamicos', reporteDinSchema);