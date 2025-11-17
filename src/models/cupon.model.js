const mongoose = require('mongoose');
const { Schema } = mongoose;

const cuponSchema = new Schema({
  name: String,
  cantidad: Number,
  sucursal: {type: Schema.Types.ObjectId, ref: 'sucursal'},
  status: {type: Number, default: 0}, // 0 activo, 1 inactivo
}, {timestamps: true});

const Cupon = mongoose.model('cupon', cuponSchema);

const flyerSchema = new Schema({
  cupon: {type: Schema.Types.ObjectId, ref: 'cupon'}
}, {timestamps: true});

const Flyer = mongoose.model('flyer', flyerSchema);

module.exports = { Cupon, Flyer };