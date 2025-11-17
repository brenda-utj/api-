const mongoose = require('mongoose');
const { Schema } = mongoose;

const aceptedValues = [0, 1, 2, 3, 4]; // baja, alta, traspaso, devolucion, venta

const modificacionSchema = new Schema({
  sucursal: {type:Schema.Types.ObjectId, ref: 'sucursal'},
  usuario: {type: Schema.Types.ObjectId, ref: 'user'},
  materia: {type: Schema.Types.ObjectId, ref: 'materia'},
  producto: {type: Schema.Types.ObjectId, ref: 'producto'},
  destino: {type: Schema.Types.ObjectId, ref: 'sucursal'},
  inventario: {type: Schema.Types.ObjectId, ref: 'inventario'},
  ticket: {type: Schema.Types.ObjectId, ref: 'venta'},
  cantidad: {type: Number, required: true},
  date: {type: Date},
  type: {type: Number, enum: {values: aceptedValues, message: 'Opción no válida'}}
}, {timestamps: true});

module.exports = mongoose.model('modificacion', modificacionSchema);
