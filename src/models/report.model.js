const mongoose = require('mongoose');
const { Schema } = mongoose;

const AttachmentSchema = new Schema({
  filename: { type: String, required: true },
  url: { type: String, required: true },
  type: { type: String } // ejemplo: "image/png", "application/pdf"
}, { _id: false });

const ReportSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'user', required: true, index: true },
  eventId: { type: Schema.Types.ObjectId, ref: 'Events', required: true, index: true },

  content: {
    type: String,
    required: [true, 'El contenido es requerido'],
    trim: true,
    minlength: [1, 'El contenido debe tener al menos 1 carácter'],
    maxlength: [2000, 'El contenido no puede exceder 2000 caracteres']
  },

  attachments: {
    type: [AttachmentSchema],
    default: []
  },
  
   userId: { type: Schema.Types.Object, ref: 'users', required: true },
   
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Report', ReportSchema);
