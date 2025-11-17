const mongoose = require('mongoose');
const { Schema } = mongoose;

const estadosSchema = new Schema({
    nombre: String,
    pais: Schema.Types.ObjectId,
    activo: Number
}, {timestamps: true});

module.exports = mongoose.model('estados', estadosSchema);