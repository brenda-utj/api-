const mongoose = require("mongoose");
const { Schema } = mongoose;

const comprasSchema = new Schema(
  {
    zona: { type: Schema.Types.ObjectId, ref: "zona" },
    sucursal: { type: Schema.Types.ObjectId, ref: "sucursal" },
    folio: Number,
    fecha: { type: Date },
    semana: String,
    proveedor: { type: Schema.Types.ObjectId, ref: "proveedor" },
    documento: String,

    //valores producto (en caso de no pollo)
    id_producto: Schema.Types.ObjectId,
    cantidad: Number,
    nombre: String,
    unidad_medida: Schema.Types.ObjectId,
    precio: Number,
    total: Number,

    userAdd: { type: Schema.Types.ObjectId, ref: "users" },
    userDel: { type: Schema.Types.ObjectId, ref: "users" },
    userUpd: { type: Schema.Types.ObjectId, ref: "users" },
    activo: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("compras", comprasSchema);
