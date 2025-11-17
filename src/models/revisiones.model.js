const { Schemas } = require('aws-sdk');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const revisionesSchema = new Schema({
    usuario_id: {type: Schema.Types.ObjectId, ref: 'usuario_id'},
    usuario: {type: String, ref: 'usuario'},
    name: {type: String, ref: 'nombre'},
    lastname: {type: String, ref: 'apellido'},
    sucursal_id: {type: Schema.Types.ObjectId, ref: 'sucursal_id'},
    sucursal: {type: String, ref: 'sucursal'},
    zona_id: {type: Schema.Types.ObjectId, ref: 'zona_id'},
    data: JSON,
    createdAt: {type: Date},
    updatedAt: {type: Date}
}, {timestamps: true});
  
module.exports = mongoose.model('revisiones', revisionesSchema);