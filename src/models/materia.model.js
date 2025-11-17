const mongoose = require('mongoose');
const { Schema } = mongoose;

const materiaSchema = new Schema({
  code: String,
  name: String,
  confRegion: {
    type: Schema.Types.Mixed,
    default: {}
  },
  description: String,
  trademark: String,
  area: String,
  type: String,
  photo: String,
  unidad: String,
  enTipoSucursal:{type:Array, default:[]},
  activo: { type: Number, default: 1},
  userAdd: {type: mongoose.Types.ObjectId},
  userUpd: {type: mongoose.Types.ObjectId},
  userDel: {type: mongoose.Types.ObjectId},
}, {timestamps: true});

materiaSchema.path('code').validate( async (value) => {
  const codeCount = await mongoose.models.materia.countDocuments({code: value});
  return !codeCount;
}, 'code already exists');

module.exports = mongoose.model('materia', materiaSchema);
