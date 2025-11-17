const mongoose = require('mongoose');
const { Schema } = mongoose;

const inventarioPasadosSchema = new Schema({
    product: {type: Schema.Types.ObjectId, ref: 'producto'},
    materia: {type: Schema.Types.ObjectId, ref: 'materia'},
    sucursal: {type: Schema.Types.ObjectId, ref: 'sucursal'},
    pos: {type: Schema.Types.ObjectId, ref: 'pos'},
    cantidad: Number,
    fecha: Date
  }, {timestamps: true});
  
  module.exports = mongoose.model('inventarioPasado', inventarioPasadosSchema);