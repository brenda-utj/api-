const { Types } = require("aws-sdk/clients/acm");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const ticketsSchema = new Schema(
  {
    titulo: { type: Schema.Types.String, required: true }, // Título obligatorio
    descripcion: { type: Schema.Types.String },
    folio: { type: Schema.Types.String },
    zona: {},
    sucursales: {
      type: [
        {
          _id: { type: Schema.Types.ObjectId, required: true },
          name: { type: String },
        },
      ],
      default: [], // si no envías nada, se setea vacío en lugar de error
    },
    tipoIncidencia: { type: Schema.Types.String },
    responsables: {
      type: [
        {
          _id: { type: Schema.Types.ObjectId, required: true },
          name: { type: String },
          lastname: { type: String },
          username: { type: String },
        },
      ],
      default: [], // si no envías nada, se setea vacío en lugar de error
    },
    departamento: {},
    prioridad: { type: Schema.Types.String },
    fechaLimite: { type: Schema.Types.Date },
    documentos: {},
    comentarios: [],
    estado: { type: Schema.Types.String },
    color: { type: Schema.Types.String },
    activo: { type: Schema.Types.Number, default: 1 }, // Campo para eliminar lógicamente
    notifications: [
      {
        _id: { type: Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
        type: { type: String, required: true },
        message: { type: String },
        newStatus: { type: String },
        oldStatus: { type: String },
        createdAt: { type: Date, default: Date.now },
        user: { },
        users: [
          {
            userId: { type: Schema.Types.ObjectId, required: true },
            read: { type: Boolean, default: false }
          }
        ]
      }
    ],
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
  },
  { timestamps: true }
);

//Modelo de comentario
const ComentarioSchema = new Schema({
  usuario: {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String },
    username: { type: String },
  },
  texto: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
});

// Exportaciones separadas
const TicketModel = mongoose.model("tickets", ticketsSchema);
const ComentarioModel = mongoose.model("comentarios", ComentarioSchema);

module.exports = {
  TicketModel,
  ComentarioModel,
};