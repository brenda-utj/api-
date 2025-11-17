const mongoose = require('mongoose');
const { Schema } = mongoose;

const menuItemSchema = new Schema({
  name: String,
  sucursal: {type: Schema.Types.ObjectId, ref: 'sucursal'},
  product: {type: Schema.Types.ObjectId, ref: 'producto'},
  productQty: Number,
  needCupon: {type: Boolean, default: false},
  isPackage: {type: Boolean},
  esComplemento: {type: Boolean, default: false},
  disponibilidad: {type: Boolean, default: true},
  startDate: Date,
  endDate: Date,
  days: Array, // aquí sería mandar el array de numeros [1,2,3,4,5,6,7]
  complementos: Number,
  onlyWithChicken: Number,
  extras: Array,
  sellPrice: Number,
  secundaryPrices: Array, 
  category: {type: Schema.Types.ObjectId, ref: 'category'},
  photo: String,
  position: Number,
  userAdd: {type: Schema.Types.ObjectId, ref: 'users', defaut: null},
  userUpd: {type: Schema.Types.ObjectId, ref: 'users',  defaut: null},
  userDel: {type: Schema.Types.ObjectId, ref: 'users',  defaut: null},

}, {timestamps: true});

module.exports = mongoose.model('menuitem', menuItemSchema);
