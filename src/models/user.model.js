const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const validRoles = [
  'analista',
  'rh',
  'gerente',
  'encargado sala',
  'super administrativo',
  'legal'
];

const userSchema = new Schema({
  name: { type: String, required: [true, 'Name is required'] },
  lastname: { type: String, required: [true, 'Lastname is required'] },
  email: { type: String, required: [true, 'Email is required'] },
  username: { type: String, required: [true, 'Username is required'] },
  password: { type: String, required: [true, 'Password is required'] },
  role: { type: String, enum: validRoles, required: [true, 'Role is required'] },
}, { timestamps: true });


// 🔐 Hash de contraseña
userSchema.methods.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};


// 🔓 Validar contraseña
userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};


// 🔎 Validación de username único
userSchema.path('username').validate(async function (value) {
  const usernameCount = await mongoose.models.user.countDocuments({ username: value });
  return !usernameCount;
}, 'Username already exists');


module.exports = mongoose.model('user', userSchema);
