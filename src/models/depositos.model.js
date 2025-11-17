/**
 *
 * Autor: Roberto Hurtado
 * Fecha: 04 de Diciembre del 2023
 * Descripcion: Model para modulo depositos
 *
 */
const mongoose = require("mongoose");
const { Schema } = mongoose;

const depositosSchema = new Schema(
	{
		zona: { type: Schema.Types.ObjectId, ref: "zona" },
		sucursal: { type: Schema.Types.ObjectId, ref: "sucursal" },
		fecha: { type: Date },
		dia: { type: String },
		deposito: { type: Number, default: 0 },
		tarjeta: { type: Number, default: 0 },
		pollo_pzas: { type: Number, default: 0 },
		uber: { type: Number, default: 0 },
		rappi: { type: Number, default: 0 },
		didi: { type: Number, default: 0 },
		userAdd: { type: Schema.Types.ObjectId, ref: "users", default: null },
		userUpd: { type: Schema.Types.ObjectId, ref: "users", default: null },
		userDel: { type: Schema.Types.ObjectId, ref: "users", default: null },
		activo: { type: Number, default: 1 },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("depositos", depositosSchema);
