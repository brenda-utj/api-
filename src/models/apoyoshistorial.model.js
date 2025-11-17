const mongoose = require("mongoose");
const { Schema } = mongoose;

const apoyoshistorialSchema = new Schema(
  {
    apoyo: { type: Schema.Types.ObjectId, ref: "apoyos" },
    fecha: { type: Date },
    sucursal: { type: Schema.Types.ObjectId, ref: "sucursals" },
    sucursalDestino: { type: Schema.Types.ObjectId, ref: "sucursals" },
    zona: { type: Schema.Types.ObjectId, ref: "zonas" },
    visto: [{ type: Schema.Types.ObjectId, ref: "sucursals" }],
    dobleVisto: [{ type: Schema.Types.ObjectId, ref: "sucursals" }],
    recibido: Boolean,
    producto: [{
      _id: { type: Schema.Types.ObjectId, ref: "productos" },
      cant: Number,
      confRegion: {}
    }],
    materia: [{
      _id: { type: Schema.Types.ObjectId, ref: "materia" },
      cant: Number,
      confRegion: {}
    }],
    userAdd: { type: Schema.Types.ObjectId, ref: "users" },
    userUpd: { type: Schema.Types.ObjectId, ref: "users" },
    userDel: { type: Schema.Types.ObjectId, ref: "users" },
    activo: Number
  },
  { timestamps: true }
);

module.exports = mongoose.model("apoyoshistorial", apoyoshistorialSchema);
