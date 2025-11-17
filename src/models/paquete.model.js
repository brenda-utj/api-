const mongoose = require('mongoose');
const { Schema } = mongoose;

const paqueteSchema = new Schema({
  code: String,
  name: String,
  description: String,
  productos: Array,
  type: String,
  cost: Number,
  unidad: String,
  category: String,
  sucursal: Schema.Types.ObjectId
}, {timestamps: true});

module.exports = mongoose.model('paquete', paqueteSchema);
