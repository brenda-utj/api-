const mongoose = require('mongoose');
const { Schema } = mongoose;

const gastosSchema = new Schema({
    zona: {type: Schema.Types.ObjectId, required: true},
    sucursal: {type: Schema.Types.ObjectId, required: true},
    fecha: {type: Schema.Types.Date, required: true},
    tipo: {type: Schema.Types.ObjectId, required: true},
    subtipo: {type: Schema.Types.ObjectId, required: true},
    descripcion: {type: Schema.Types.String, required: true},
    total_efectivo: {type: Schema.Types.Number, required: true},
    total_tarjeta: {type: Schema.Types.Number, required: true},
    userAdd: { type: Schema.Types.ObjectId, ref: "users" },
    userDel: { type: Schema.Types.ObjectId, ref: "users" },
    userUpd: { type: Schema.Types.ObjectId, ref: "users" },

    activo: {type: Schema.Types.Number, required: true},
}, {timestamps: true});

module.exports = mongoose.model('gastos', gastosSchema);
