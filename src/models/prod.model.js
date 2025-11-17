const mongoose = require('mongoose');
const { Schema } = mongoose;

const prodSchema = new Schema({
    id: Number,
    status: Number,
    qty: Number,
    oven: Number,
    stick: Number,
    starts: Date,
    ends: Date,
    sucursal: {type: Schema.Types.ObjectId, ref: 'sucursal'},
    producto: {type: Schema.Types.ObjectId, ref: 'producto'},
    pos: {type: Schema.Types.ObjectId, ref: 'pos'}
}, {timestamps: true});

module.exports = mongoose.model('prod', prodSchema);

