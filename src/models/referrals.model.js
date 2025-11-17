/**
 * ******************************
 *   POLLO PECHUGON ROSTICERIAS
 * ******************************
 * Author: Roberto Hurtado
 * Date: 12-12-2024
 * Description: Modelo principal para Remisiones
 */

const mongoose = require("mongoose");
const { Schema } = mongoose;

const referralsSchema = new Schema(
  {
    zone: { type: Schema.Types.Mixed },
    branch: {type: Schema.Types.Mixed},
    date: {type: Schema.Types.Date},
    week: {type: Schema.Types.Number},
    folio: {type: Schema.Types.String },
    typeReferral: {type: Schema.Types.String},
    supplier: {type: Schema.Types.Mixed},
    file: {type: Schema.Types.String},
    chikenRange: { type: Schema.Types.Mixed },
    boxesReferral: { type: Schema.Types.String },
    partsReferral: { type: Schema.Types.String },
    kgReferral: { type: Schema.Types.String },
    amountReferral: { type: Schema.Types.String },
    pricePartReferral: { type: Schema.Types.String },
    priceKgReferral: { type: Schema.Types.String },
    weightPartReferral: { type: Schema.Types.String },
    //REAL
    parts: { type: Schema.Types.String },
    boxesReal: { type: Schema.Types.String },
    returnPartsReal: { type: Schema.Types.String },
    returnKgReal: { type: Schema.Types.String },
    returnRepletion: { type: Schema.Types.String },
    kgReal: { type: Schema.Types.String },
    weightPartReal: { type: Schema.Types.String },
    agreedAmount: { type: Schema.Types.String },
    creditNote: { type: Schema.Types.String },
    
    userAdd: {
      _id: mongoose.Schema.Types.ObjectId,
      name: String,
      lastname: String,
      username: String,
    },
    userUpd: {
      _id: mongoose.Schema.Types.ObjectId,
      name: String,
      lastname: String,
      username: String,
    },
    userDel: {
      _id: mongoose.Schema.Types.ObjectId,
      name: String,
      lastname: String,
      username: String,
    },
    activo: { type: Schema.Types.Number, default: 1 },
  },
  { timestamps: true }
);
  
module.exports = mongoose.model("referrals", referralsSchema);