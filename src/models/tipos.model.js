const mongoose = require('mongoose');
const { Schema } = mongoose;

const tiposSchema = new Schema({
    nombre: { type: String, required: true },
    descripcion: String,
    subtipo: [{
        nombre: { type: String, ref: 'subtipos' },
        descripcion: { type: String, ref: 'subtipos' },
    }],
    activo: { type: Number, default: 1 },
    userAdd: { type: Schema.Types.ObjectId, ref: 'users', defaut: null },
    userUpd: { type: Schema.Types.ObjectId, ref: 'users', defaut: null },
    userDel: { type: Schema.Types.ObjectId, ref: 'users', defaut: null },
}, { timestamps: true });

module.exports = mongoose.model('tipos', tiposSchema);