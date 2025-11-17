const mongoose = require('mongoose');
const { Schema } = mongoose;

const alianzasSchema = new Schema({
    proveedor: { type: Schema.Types.ObjectId, ref: "proveedor" },
    descripcion: String,
    items: {type: Array, default: []},
    activo: { type: Number, default: 1 },
    userAdd: { type: Schema.Types.ObjectId, ref: 'users', defaut: null },
    userUpd: { type: Schema.Types.ObjectId, ref: 'users', defaut: null },
    userDel: { type: Schema.Types.ObjectId, ref: 'users', defaut: null },
}, { timestamps: true });

module.exports = mongoose.model('alianzas', alianzasSchema);
