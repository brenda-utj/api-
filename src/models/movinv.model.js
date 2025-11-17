const mongoose = require('mongoose');
const { Schema } = mongoose;

const movinvSchema = new Schema({
    id: Number,
    cant: Number,
    costo: Number,
    tipo: Number,
    subtipo: String,
    fecha: Date,
    comments: String,
    venta: {type:Schema.Types.ObjectId, ref: 'venta'},
    sucursal: {type:Schema.Types.ObjectId, ref: 'sucursal'},
    desucursal: {type:Schema.Types.ObjectId, ref: 'sucursal'},
    asucursal: {type:Schema.Types.ObjectId, ref: 'sucursal'},
    materia: {type: Schema.Types.ObjectId, ref: 'materia'},
    producto: {type: Schema.Types.ObjectId, ref: 'producto'},
    pos: {type: Schema.Types.ObjectId, ref: 'pos'}
}, {timestamps: true});

module.exports = mongoose.model('movinv', movinvSchema);
//module.exports = mongoose.model('movinvs2021', movinvSchema);

