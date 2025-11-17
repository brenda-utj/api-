const mongoose = require('mongoose');
const { Schema } = mongoose;

const identitySchema = new Schema({
    sucursal: {type: Schema.Types.ObjectId, ref: 'sucursal'},
    usuario: {type: Schema.Types.ObjectId, ref: 'user'}
}, {timestamps: true});

module.exports = mongoose.model('identity', identitySchema);

