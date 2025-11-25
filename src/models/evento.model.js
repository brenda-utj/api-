const mongoose = require('mongoose');
const { Schema } = mongoose;

const eventSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },

    startTime: { 
      type: String, 
      required: true, 
      match: /^([01]\d|2[0-3]):([0-5]\d)$/ 
    },

    endTime: { 
      type: String, 
      required: true, 
      match: /^([01]\d|2[0-3]):([0-5]\d)$/ 
    },

    place: { type: String, required: true },
    address: { type: String, required: true },

    location: {
      lat: { type: Number, required: true, min: -90, max: 90 },
      lng: { type: Number, required: true, min: -180, max: 180 },
    },

    emails: [
      {
        name: { type: String, required: true },
        email: {
          type: String,
          required: true,
          match: [/.+@.+\..+/, 'Por favor ingrese un correo válido'],
        },
        emailSent: { type: Boolean, default: false },
      },
    ],

    attached: [
      {
        fileName: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],

    userAdd: { type: Schema.Types.Object, ref: 'users', required: true },
    activo: { type: Number, default: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Events', eventSchema);
