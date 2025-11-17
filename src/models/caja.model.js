const mongoose = require('mongoose');
const { Schema } = mongoose;

const validTypes = [0, 1, 2, 3]; // alta, baja, ajuste, credito
const cajaSchema = new Schema({
  sucursal: {type: Schema.Types.ObjectId, ref: 'sucursal'},
  tarjeta: Number,
  efectivo: Number
}, {timestamps: true});

const Caja = mongoose.model('caja', cajaSchema);

const movimientoCajaSchema = new Schema({
  caja: {type: Schema.Types.ObjectId, ref: 'caja'},
  cantidad: Number,
  esTarjeta: {type: Boolean, default: false},
  sucursal: {type: Schema.Types.ObjectId, ref: 'sucursal'},
  fecha: Date,
  usuario: {type: Schema.Types.ObjectId, ref: 'user'},
  description: {type: String},
  tipo: {type: Number, enum: validTypes},
  subtipo: String,
  pos: {type: Schema.Types.ObjectId, ref: 'pos'},
  method: String,
  detalles_pago: {cash: String, card: String},
}, {timestamps: true});

const MovimientoCaja = mongoose.model('movimientocaja', movimientoCajaSchema);

const recurrenteSchema = new Schema({
  cantidad: Number,
  name: String,

}, {timestamps: true});

recurrenteSchema.path('name').validate( async (value) => {
  const nameCount = await mongoose.models.recurrente.countDocuments({name: value});
  return !nameCount;
}, 'name already exists');
const Recurrente = mongoose.model('recurrente', recurrenteSchema);

module.exports = {
  Caja, MovimientoCaja, Recurrente
};
