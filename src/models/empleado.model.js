const mongoose = require('mongoose');
const { Schema } = mongoose;

const empleadoSchema = new Schema({
  name: { type: String, required: [true, 'Name is required'] },
  lastname: { type: String, required: [true, 'Lastname is required'] },
  address: Schema.Types.Mixed,
  phone: { type: String, required: [true, 'Phone is required'] },
  email: String,
  rol: {type: String, required: [true, 'Rol is required']},
  department: { type: Schema.Types.ObjectId, ref: 'departamentos' },
  sueldo: {type: Number, required: [true, 'Sueldo is required']},
  zona: {type: Schema.Types.ObjectId, ref: 'zona', required: [true, 'Zona is required']},
  fechaIngreso: {type: Date},
  activo:{type: Boolean,default: true},
  fechaSalida: {type: Date},
  tipoempleado: String, 
  numeroempleado: String,
  name_ce: String,
  phone_ce: String,
  kinship_ce: String,
  name_be: String,
  percentage_be: String,
  kinship_be: String,
  
  photo: String,
  ine: String,
  compDomicilio: String,
  acta: String,
  antecedentes: String,
  curp: String,
  rfc: String,
  nss: String,
  retencion: String,
  situacionFiscal: String,
  documentos: {},

  prestamos: { type: Array, default: [] },
  abonos: { type: Array, default: [] },

  deuda: {type: Number,default: 0.0},
  huella: {type: String,default:null},
  
  ultimaNomina: { type: Schema.Types.ObjectId, ref: 'nomina' },
  tipocontrato: { type: Schema.Types.ObjectId, ref: 'tipocontratos' },
  historial: [{
    fechaIngreso: { type: Date },
    fechaSalida: { type: Date },
    recomendacion: { type: String },
    comentarios: { type: String },
    tipocontrato: { type: Schema.Types.ObjectId, ref: 'tipocontratos' }
  }],
}, { timestamps: true });

module.exports = mongoose.model('empleado', empleadoSchema);