const mongoose = require('mongoose');
const { Schema } = mongoose;

const subtipoSchema = new Schema({
    tipo_id: {type: Schema.Types.ObjectId, ref:'tipos'},
    nombre: { type: String, required: true },
    descripcion: String,
    activo:  { type: Number, default: 1 },
    userAdd: { type: Schema.Types.ObjectId, ref: 'users', defaut: null },
    userUpd: { type: Schema.Types.ObjectId, ref: 'users', defaut: null },
    userDel: { type: Schema.Types.ObjectId, ref: 'users', defaut: null },
}, { timestamps: true });

module.exports = mongoose.model('subtipos', subtipoSchema);