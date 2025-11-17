const mongoose = require('mongoose');
const { Schema } = mongoose;

const mermaTypes = ['materia', 'finalProduct'];
const mermaProductSchema = new Schema({
  code: String,
  name: String,
  description: String,
  materia: {type: Schema.Types.ObjectId, ref: 'materia'},
  finalProduct: {type: Schema.Types.ObjectId, ref: 'producto'},
  sucursal: {type: Schema.Types.ObjectId, ref: 'sucursal'},
  type: {type: String, enum: mermaTypes},
  qty: Number,
  unidad: String
}, {timestamps: true});

module.exports = mongoose.model('merma', mermaProductSchema);