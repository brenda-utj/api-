const mongoose = require("mongoose");
const { Schema } = mongoose;

const apoyosSchema = new Schema(
  {
    fechaInicio: { type: Date },
    fechaFin: { type: Date },
    zona: { type: Schema.Types.ObjectId, ref: "zonas" },
    sucursal: { type: Schema.Types.ObjectId, ref: "sucursals" },
    visto: [{ type: Schema.Types.ObjectId, ref: "sucursals" }],
    dobleVisto: [{ type: Schema.Types.ObjectId, ref: "sucursals" }],
    producto: [
      {
        _id: { type: Schema.Types.ObjectId, ref: "productos" },
        name: String,
        cantRequerida: Number,
        cantRestante: Number,
        confRegion: {}
      },
    ],
    materia: [
      {
        _id: { type: Schema.Types.ObjectId, ref: "materia" },
        name: String,
        cantRequerida: Number,
        cantRestante: Number,
        confRegion: {}
      },
    ],
    userAdd: { type: Schema.Types.ObjectId, ref: "users" },
    userUpd: { type: Schema.Types.ObjectId, ref: "users" },
    userDel: { type: Schema.Types.ObjectId, ref: "users" },
    activo: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("apoyos", apoyosSchema);
