const mongoose = require('mongoose');
const { Schema } = mongoose;

const vacanteSchema = new Schema({
  puesto: { type: mongoose.Schema.Types.ObjectId, ref: 'puestos', required: true },
  descripcionPuesto: { type: String, required: true },
  aniosExperiencia: { type: Number, required: true },
  cantidad: { type: Number, required: true },
  descripcionVacante: { type: String, required: true },
  direccion: { type: String, required: true },
  estudiosMinimos: { type: String },
  fechaContratacion: { type: Date, required: true },
  formaTrabajo: { type: String, required: true },
  idiomas: [
    {
      idioma: { type: String },
      nivel: { type: String }
    }
  ],
  jornadaLaboral: { type: String, required: true },
  pago: { type: String, required: true },
  rangoEdad: [
    {
      minimo: { type: Number, required: true },
      maximo: { type: Number, required: true }
    }
  ],
  salario: { type: Number, required: true },
  sucursal: { type: mongoose.Schema.Types.ObjectId, ref: 'sucursal', required: true },
  tipoContrato: { type: mongoose.Schema.Types.ObjectId, ref: 'tipocontrato', required: true },
  tipoEmpleado: { type: mongoose.Schema.Types.ObjectId, ref: 'tipoempleado', required: true },
  zona: { type: mongoose.Schema.Types.ObjectId, ref: 'zona', required: true },
  userUpd: { type: Schema.Types.Object, ref: "users" }, 
  userAdd: { type: Schema.Types.Object, ref: "users" },
  userDel: { type: Schema.Types.Object, ref: "users" },
  activo: { type: Schema.Types.Number, default: 1 },
  estatus: { type: Schema.Types.Number, default: 1 },
}, 
{ timestamps: true });
module.exports = mongoose.model('Vacante', vacanteSchema);
