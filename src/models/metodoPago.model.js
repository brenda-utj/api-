const mongoose = require('mongoose');
const { Schema } = mongoose;

const metododePagoSchema = new Schema({
  name: String,
  description: String
}, {timestamps: true});

module.exports = mongoose.model('metodo', metododePagoSchema);
