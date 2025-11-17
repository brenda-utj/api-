const mongoose = require('mongoose');
const { Schema } = mongoose;

const actividadesSchema = new Schema({
    zona: {type: Schema.Types.ObjectId, ref: 'zona'},
    sucursal: {type: Schema.Types.ObjectId, ref: 'sucursal'},
    usuario: {type: Schema.Types.ObjectId, ref: 'user'},
    tipo: {type: Schema.Types.String, ref: 'tipo'},
    template: {type: Schema.Types.ObjectId}, 
    actividades: {type: Array, default: []},  
    userAdd: {type: Schema.Types.ObjectId},   
    userUpd: {type: Schema.Types.ObjectId},   
    userDel: {type: Schema.Types.ObjectId},
    activo: {type: Schema.Types.Number, default: 1},   
  }, {timestamps: true});
  
  module.exports = mongoose.model('actividades', actividadesSchema);