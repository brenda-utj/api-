const mongoose = require('mongoose');
const { Schema } = mongoose;

const gastoSchema = new Schema({
  metodo: String,
  type: String,
  address: Schema.Types.Mixed,
  clientName: String,
  esCortesia: Boolean,
  date: {type: Date},
  razon: String,
  cupon: String,
  ticket: Number,
  date: Date,
  esTarjeta: Boolean,
  isDelivery: Boolean,
  deliveryMethod: String,
  pos: {type: Schema.Types.ObjectId, ref: 'pos'},
  isCanceled: {type: Boolean, default: false},
  total: Number,
  sucursal: {type: Schema.Types.ObjectId, ref: 'sucursal'},
  usuario: {type: Schema.Types.ObjectId, ref: 'user'},
}, {timestamps: true});

module.exports = mongoose.model('gasto', gastoSchema);