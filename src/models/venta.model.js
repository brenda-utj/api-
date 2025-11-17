const mongoose = require("mongoose");
const { Schema } = mongoose;

const ventaSchema = new Schema(
  {
    products: [
      {
        product: { type: Schema.Types.ObjectId, ref: "producto" },
        inventario: { type: Schema.Types.ObjectId, ref: "inventario" },
        // item: {type: Schema.Types.ObjectId, ref: 'menuitem'},
        cantidad: Number
      }
    ],
    items: [
      {
        menuItem: {
          _id: String,
          name: String,
          sell_price: Number
        },
        complements: [
          {
            label: String,
            val: String,
            qty: Number
          }
        ],
        qty: Number
      }
    ],
    metodo: String,
    metodo_pago: String,
    detalles_pago: { cash: String, card: String },
    type: String,
    address: Schema.Types.Mixed,
    clientName: String,
    esCortesia: Boolean,
    date: { type: Date },
    razon: String,
    cupon: String,
    ticket: Number,
    date: Date,
    esTarjeta: Boolean,
    isDelivery: Boolean,
    deliveryMethod: String,
    pos: { type: Schema.Types.ObjectId, ref: "pos" },
    isCanceled: { type: Boolean, default: false },
    // product: {type: Schema.Types.ObjectId, ref: 'producto'},
    // paquete: {type: Schema.Types.ObjectId, ref: 'paquete'},
    total: Number,
    sucursal: { type: Schema.Types.ObjectId, ref: "sucursal" },
    usuario: { type: Schema.Types.ObjectId, ref: "user" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("venta", ventaSchema);
