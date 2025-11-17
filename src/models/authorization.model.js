const mongoose = require('mongoose');
const { Schema } = mongoose;

const authorizationSchema = new Schema({
    sucursal: {type: Schema.Types.ObjectId, ref: 'sucursal'},
    usuario: {type: Schema.Types.ObjectId, ref: 'user'},
    zona: {type: Schema.Types.ObjectId, ref: 'zona'},
    accion: String,
    clave: String,
    detalles: String,
    modulo: String,

}, {timestamps: true});

module.exports = mongoose.model('authorization', authorizationSchema);