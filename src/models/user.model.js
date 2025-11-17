const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const validRoles = ['cocinero', 'encargado de sucursal', 'gerente', 'auxiliar de zona', 'administrativo', 'super administrativo', 'supervisor', 'rh de zona'];

const userSchema = new Schema({
  name: {type: String, required: [true, 'Name is required']},
  lastname: {type: String, required: [true, 'Lastname is required']},
  email: {type: String, required: [true, 'Email is required']},
  username: {type: String, required: [true, 'Username is required']},
  password: {type: String, required: [true, 'Password is required']},
  sucursal: {type: Schema.Types.ObjectId, ref: 'sucursal'},
  sucursales: {type: Array},
  zona: {type: Schema.Types.ObjectId, ref: 'zona'},
  zonas: {type: Array},
  // zonas: [{zona: {type: Schema.Types.ObjectId, ref: 'zona'}}],
  role: {type: String, enum: validRoles, required: [true, 'Role is required']},
  authkey: {type: String},
  credentials: mongoose.Schema.Types.Mixed,
  activo: { type: Number, default: 1},
  userAdd: {type: mongoose.Types.ObjectId},
  userUpd: {type: mongoose.Types.ObjectId},
  userDel: {type: mongoose.Types.ObjectId},
}, {timestamps: true});

userSchema.methods.hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

userSchema.methods.isValidPassword = async (password, user) => {
  return await bcrypt.compare(password, user.password);
};

userSchema.path('username').validate( async (value) => {
  const usernameCount = await mongoose.models.user.countDocuments({username: value});
  return !usernameCount;
}, 'username already exists');

module.exports = mongoose.model('user', userSchema);
