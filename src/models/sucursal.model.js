const mongoose = require("mongoose");
const { Schema } = mongoose;

const sucursalSchema = new Schema(
  {
    name: { type: String, required: [true, "Name is required"] },
    zona: {
      type: Schema.Types.ObjectId,
      ref: "zona",
      required: [true, "Zona is required"]
    },
    address: { type: Schema.Types.Mixed },
    ticketHeader: String,
    ticketFooter: String,
    ultimoTicket: { type: Number, default: 0 },
    location: { type: Schema.Types.Mixed },
    hora_cierre: String,
    configuracion: {
      type: JSON,
      default: {
        tipo: "Sucursal pollo",
        bajarBarrasAntes: false,
        cerrarSinDeposito: false,
        numeroCopiasCorte: 1
      }
    },
    activo: { type: Number, default: 1 },
    online: { type: Number, default: 1 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("sucursal", sucursalSchema);
