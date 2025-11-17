const mongoose = require('mongoose');
const { Schema } = mongoose;

const identityAdminSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'user', required: true},
    zona: { type: Schema.Types.ObjectId, ref: 'zona', required: true}
}, { timestamps: true});

module.exports = mongoose.model('identitiesadmin', identityAdminSchema);