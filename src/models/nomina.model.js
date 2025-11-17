const mongoose = require('mongoose');
const { Schema } = mongoose;

const nominaSchema = new Schema({
  
  fechaInicio: {type: Date, required: [true, 'Fecha de inicio is required']},
  fechaFin: {type: Date, required: [true, 'Fecha de fin is required']},
  fechaPago: {type: Date},
  pagada: {type:Boolean, default:false},
  ubicacion: {type: String, default:'sucursal'},

  diasTrabajados: {type: Number, required: [true, 'Dias trabajados is required']},
  monto: {type: Number, required: [true, 'Monto is required']},
  abonoAPrestamo: {type:Number, default:0.0},
  prestamo: {type:Number, default:0.0},
  bono: {type:Number, default:0.0},
  descuento: {type:Number, default:0.0},

  total: {type:Number, required: [true, 'Total is required']},

  sucursal: {type: Schema.Types.ObjectId, ref: 'sucursal', required: [true, 'Sucursal is required']},
  usuario: {type: Schema.Types.ObjectId, ref: 'user'},
  empleado: {type: Schema.Types.ObjectId, ref: 'empleado', required: [true, 'Empleado is required']},
  userAdd: { type: Schema.Types.ObjectId, ref: "users", default: null },
  userUpd: { type: Schema.Types.ObjectId, ref: "users", default: null },
  userDel: { type: Schema.Types.ObjectId, ref: "users", default: null },
}, {timestamps: true});

module.exports = mongoose.model('nomina', nominaSchema);