const mongoose = require('mongoose');
const { Schema } = mongoose;

const compraSchema = new Schema({
  materia: {type: Schema.Types.ObjectId, ref: 'materia'},
  sucursal: {type: Schema.Types.ObjectId, ref: 'sucursal'},
  // meter id inventario
  cost: Number,
  quantity: Number,
  unidad: String,
}, {timestamps: true});

module.exports = mongoose.model('compra', compraSchema);
