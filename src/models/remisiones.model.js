const { Schemas } = require('aws-sdk');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const remisionesSchema = new Schema({
    sucursal: {type: Schema.Types.ObjectId, ref: 'sucursal'},
    pos: {type: Schema.Types.ObjectId, ref: 'pos'},
    fecha: {type: Date},
    remision: {type: Schema.Types.String, required: [true, 'Remision is required']},
    codigo: {type: Schema.Types.String, required: [true, 'Code is Required']},

    rango: String,
    cajas: Number,
    piezas: Number,
    kilos: Number,
    averageWeight: Number,
    valido: String,

    rangoReal: String,
    cajasReal: Number,
    piezasReal: Number,
    kilosReal: Number,
    averageWeightReal: Number,
    validoReal: String,

    //Actualización
    merma: Number,
    devolucion: Number,
    tipo: String,

    lote: String

}, {timestamps: true});
  
module.exports = mongoose.model('remisiones', remisionesSchema);