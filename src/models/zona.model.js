const mongoose = require('mongoose');
const { Schema } = mongoose;

const zonaSchema = new Schema({
  name: {type: String, required: [true, 'Name cannot be null']},
  location: {type: Schema.Types.Mixed},
  correo: {type: String},
}, {timestamps: true});

module.exports = mongoose.model('zona', zonaSchema);
