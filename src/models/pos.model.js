const mongoose = require('mongoose');
const { Schema } = mongoose;

const posSchema = new Schema({
    id: Number,
    sucursal: {type: Schema.Types.ObjectId, ref: 'sucursal'},
    usuario: {type: Schema.Types.ObjectId, ref: 'user'},
    efectivo: Number,
    date: Date
}, {timestamps: true});

module.exports = mongoose.model('pos', posSchema);

