const mongoose = require('mongoose');
const { Schema } = mongoose;

const productionSchema = new Schema({
  product: {type: Schema.Types.ObjectId, ref: 'producto'},
  sucursal: {type: Schema.Types.ObjectId, ref: 'sucursal'},
}, {timestamps: true});

module.exports = mongoose.model('production', productionSchema);
