/**
 * ******************************
 *   POLLO PECHUGON ROSTICERIAS
 * ******************************
 * Author: Roberto Hurtado
 * Date: 12-12-2024
 * Description: Modelo principal para Rango Pollo
 */

const mongoose = require("mongoose");
const { Schema } = mongoose;

const chikenRangesSchema = new Schema(
  {
    supplier: { type: Schema.Types.Mixed },
    // zones: {type: Schema.Types.Mixed},
    zones: [
      {
        _id: { type: Schema.Types.ObjectId },
        name: { type: Schema.Types.String },
      },
    ],
    ranges: { type: Schema.Types.Array },
    userUpd: { type: Schema.Types.Mixed },
    userAdd: { type: Schema.Types.Mixed },
    userDel: { type: Schema.Types.Mixed },
    activo: { type: Schema.Types.Number, default: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("chikenranges", chikenRangesSchema);
