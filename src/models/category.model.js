const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorySchema = new Schema({
  name: String,
  visible: {type:Boolean, default: true},
  photo: String,
  products: Array,
  activo: { type: Number, default: 1},
  userAdd: {type: mongoose.Types.ObjectId},
  userUpd: {type: mongoose.Types.ObjectId},
  userDel: {type: mongoose.Types.ObjectId},
}, {timestamps: true});

categorySchema.path('name').validate( async (value) => {
  const nameCount = await mongoose.models.category.countDocuments({name: value});
  return !nameCount;
}, 'name already exists');

module.exports = mongoose.model('category', categorySchema);
