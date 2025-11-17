const mongoose = require('mongoose');
const { Schema } = mongoose;

const finalProductSchema = new Schema({
  code: String,
  name: String,
  confRegion: {
    type: Schema.Types.Mixed,
    default: {}
  },  
  description: String,
  materias: Array,
  type: String,
  photo: String,
  cost: Number,
  esComplemento: Boolean,
  tiempo: Number,
  isMerma: Boolean,
  unidad: String,
  cantidad: Number,
  enTipoSucursal:{type:Array, default:[]},
  activo: { type: Number, default: 1},
  userAdd: {type: mongoose.Types.ObjectId},
  userUpd: {type: mongoose.Types.ObjectId},
  userDel: {type: mongoose.Types.ObjectId},
}, {timestamps: true});

finalProductSchema.path('code').validate( async (value) => {
  const codeCount = await mongoose.models.producto.countDocuments({code: value});
  return !codeCount;
}, 'code already exists');

module.exports = mongoose.model('producto', finalProductSchema);
