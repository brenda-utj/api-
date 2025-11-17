const mongoose = require('mongoose');
const { Schema } = mongoose;

const inventariosSchema = new Schema({
  product: {type: Schema.Types.ObjectId, ref: 'producto'},
  materia: {type: Schema.Types.ObjectId, ref: 'materia'},
  sucursal: {type: Schema.Types.ObjectId, ref: 'sucursal'},
  sellPrice: {type: Number},
  area: {type: String},
  available: Boolean,
  cantidad: {type: Number, default: 0},
  activo: {type: Number, default: 1},
  userAdd: {type: Schema.Types.ObjectId, ref: 'users'},
  userUpd: {type: Schema.Types.ObjectId, ref: 'users'},
  userDel: {type: Schema.Types.ObjectId, ref: 'users'},
}, {timestamps: true});

module.exports = mongoose.model('inventario', inventariosSchema);
