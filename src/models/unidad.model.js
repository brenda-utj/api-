const mongoose = require('mongoose');
const { Schema } = mongoose;

const unidadSchema = new Schema({
  name: String,
  activo: { type: Number, default: 1},
  userAdd: {type: mongoose.Types.ObjectId},
  userUpd: {type: mongoose.Types.ObjectId},
  userDel: {type: mongoose.Types.ObjectId},
}, {timestamps: true});

module.exports = mongoose.model('unidad', unidadSchema
);