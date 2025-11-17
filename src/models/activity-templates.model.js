/**
 * ******************************
 *   POLLO PECHUGON ROSTICERIAS
 * ******************************
 * Author: Roberto Hurtado
 * Date: 08-03-2024
 * Description: Modelo principal para Platillas Actividades
 */

const mongoose = require("mongoose");
const { Schema } = mongoose;

const activityTemplatesSchema = new Schema(
  {
    name: { type: Schema.Types.String, required: [true, "El nombre es requerido"] },
    description: {type: Schema.Types.String},
    activities: {type: Schema.Types.Array},
    userUpd: { type: Schema.Types.ObjectId, ref: "users" }, 
    userAdd: { type: Schema.Types.ObjectId, ref: "users" },
    userDel: { type: Schema.Types.ObjectId, ref: "users" },
    estatus: { type: Schema.Types.Number, default: 1 },
    activo: { type: Schema.Types.Number, default: 1 },
  },
  { timestamps: true }
);
  
module.exports = mongoose.model("activitytemplates", activityTemplatesSchema);