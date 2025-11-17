const mongoose = require("mongoose");
const { Schema } = mongoose;

const abonosSchema = new Schema({
    compra: { type: Schema.Types.ObjectId, ref: "compra" },
    zona_pago: { type: Schema.Types.ObjectId },
    sucursal: { type: Schema.Types.ObjectId },
    fecha: { type: Date },
    tipo: { type: Schema.Types.ObjectId },
    subtipo: { type: Schema.Types.ObjectId },
    descripcion: String,
    total_efectivo: Number,
    total_tarjeta: Number,
    documento: String,

}, {timestamps: true});

module.exports = mongoose.model('abonos', abonosSchema);