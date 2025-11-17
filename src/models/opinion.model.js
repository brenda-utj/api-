const mongoose = require('mongoose');
const { Schema } = mongoose;

const opinionSchema = new Schema({

  sucursal: {type: Schema.Types.ObjectId, ref: 'sucursal', required: [true, 'Sucursal is required']},
  zona: {type: Schema.Types.ObjectId, ref: 'zona', required: [true, 'Zona is required']},
  valoracion: {type: String, required: [true, 'Valoracion is required']},
  comentario: {type: String, default:null},
  contacto: {type: String, default:null},
  
}, {timestamps: true});

module.exports = mongoose.model('opinion', opinionSchema);