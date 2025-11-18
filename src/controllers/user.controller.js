const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const keys = require("../utils/keys");
const bcrypt = require("bcryptjs");

const userCtrl = {};

// Crear usuario
userCtrl.signUp = async (req, res) => {
  try {
    let data = req.body;

    const { password, username } = req.body;
    let userInstance = new User(data);

    userInstance.password = await userInstance.hashPassword(password);
    userInstance.username = username.toLowerCase();

    const user = await userInstance.save();
    const token = jwt.sign(user.toJSON(), keys.secret);

    res.json({ message: "User created", user, token });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// Login
userCtrl.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      username: username.toLowerCase(),
      activo: 1
    });

    if (!user)
      return res.status(404).json({ message: "Usuario no existe o inactivo" });

    const validation = await user.isValidPassword(password, user);

    if (!validation)
      return res.status(404).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign(user.toJSON(), keys.secret);

    res.json({ message: "Logged In", user, token });
  } catch (error) {
    res.json(error.message);
  }
};

// Actualizar usuario
userCtrl.updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const updated = await User.findOneAndUpdate(
      { _id: id },
      { $set: data },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.json(error.message);
  }
};

// Eliminar usuario (soft delete)
userCtrl.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    const deleted = await User.findOneAndUpdate(
      { _id: id },
      { $set: { activo: 0 } }
    );

    if (!deleted) return res.status(404).json("Usuario no encontrado");

    res.json("Usuario eliminado");
  } catch (error) {
    res.json(error.message);
  }
};

// Obtener todos
userCtrl.getUsers = async (req, res) => {
  try {
    const users = await User.find({ activo: { $ne: 0 } });
    res.json(users);
  } catch (error) {
    res.json(error.message);
  }
};

// Obtener uno
userCtrl.getUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    res.json(user);
  } catch (error) {
    res.json(error.message);
  }
};

// Cambiar password
userCtrl.changePassword = async (req, res) => {
  try {
    const { password } = req.body;

    let pass = await bcrypt.hash(password, 10);

    const user = await User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { password: pass } },
      { new: true }
    );

    res.json(user);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = userCtrl;
