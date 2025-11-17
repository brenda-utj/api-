const { Schemas } = require("aws-sdk");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const proveedoresSchema = new Schema(
  {
    name: { type: Schema.Types.String, required: [true, "Name is required"] },
    telephone: {type: Schema.Types.Number, required: [true, 'Telephone is required']},
    mail: {type: Schema.Types.String},
    businessName: {type: Schema.Types.String},
    rfc: {type: Schema.Types.String},
    street: {type: Schema.Types.String},
    noExt: {type: Schema.Types.String},
    noInt: String,
    colonia: {type: Schema.Types.String},
    cp: {type: Schema.Types.Number},
    country: Schema.Types.ObjectId,
    state: Schema.Types.ObjectId,
    city: Schema.Types.ObjectId,
    bankAccount: {type: String},
    constancyName: {type: Schema.Types.String},
    constancy: {type: Schema.Types.String},
    // producto: {type: Schema.Types.String},
    // producto: {type: Array, default:[]},
    producto: { },
    tipo_proveedor: { type: Schema.Types.String, default: 'credito', required: [true, "Tipo proveedor is required"] },
    monto_credito: { type: Schema.Types.Number, default: 0 },
    adeudo_actual: { type: Schema.Types.Number, default: 0 },
    userUpd: { type: Schema.Types.ObjectId, ref: "users" }, 
    userAdd: { type: Schema.Types.ObjectId, ref: "users" },
    userDel: { type: Schema.Types.ObjectId, ref: "users" },
    activo: { type: Schema.Types.Number, default: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("proveedores", proveedoresSchema);