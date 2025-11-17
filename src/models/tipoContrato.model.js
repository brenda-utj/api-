const mongoose = require('mongoose');
const { Schema } = mongoose;

const tipoContratoSchema = new Schema({
    name: String,
    description: String,
    activo: { type: Number, default: 1 },
    userAdd: { type: Schema.Types.ObjectId, ref: 'users', defaut: null },
    userUpd: { type: Schema.Types.ObjectId, ref: 'users', defaut: null },
    userDel: { type: Schema.Types.ObjectId, ref: 'users', defaut: null },
}, { timestamps: true });

module.exports = mongoose.model('tipocontrato', tipoContratoSchema);