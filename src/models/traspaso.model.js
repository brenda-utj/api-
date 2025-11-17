const mongoose = require('mongoose');
const { Schema } = mongoose;

const traspasoSchema = new Schema({
  from: {type: Schema.Types.ObjectId, ref: 'inventario'},
  to: {type: Schema.Types.ObjectId, ref: 'inventario'},
  name: String,
  quantity: Number,
  costo: Number,
  requestor: {type: Schema.Types.ObjectId, ref: 'user'},
  approver: {type: Schema.Types.ObjectId, ref: 'user'},
  status: Number // 0 requested, 1 approved, 2 rejected
}, {timestamps: true});

module.exports = mongoose.model('traspaso', traspasoSchema);
