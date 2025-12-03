const User = require("../models/user.model");
const identityadmin = require("../models/identityadmin.model");
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

    const validation = await user.isValidPassword(password);

    if (!validation)
      return res.status(404).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign(user.toJSON(), keys.secret);

    res.json({ message: "Logged In", user, token });
  } catch (error) {
    res.json(error.message);
  }
};

//Método para cerrar sesión
userCtrl.logout = (req, res) => {
  try {
    // No necesitas lógica del lado del backend si no guardas tokens
    return res.status(200).json({ message: "Sesión cerrada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
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







//Método para encontrar una sesión del admin
  userCtrl.findNumberIdentities = async (req, res) => {
    try {
      const { identity } = req.params;

      const identities = await IdentityAdmin.countDocuments({ _id: identity });
      const identitiesData = await IdentityAdmin.find({ _id: identity });

      let now = new Date();
      let sessionExpired = false;

      for (let identity of identitiesData) {
        let createdAt = new Date(identity.createdAt);
        let timeDifference = now - createdAt;
        let hoursDifference = timeDifference / (1000 * 60 * 60);

        if (hoursDifference >= 12) {
          sessionExpired = true;
          break; // Si se encuentra una identidad con más de 24 horas, no es necesario seguir buscando
        }
      }

      let response = {
        identities,
        sessionExpired,
      };

      res.json(response);
    } catch (error) {
      console.error("Error en findNumberIdentities:", error);
      res.status(500).json({ error: "Error en el servidor" });
    }
  };

  userCtrl.getUserDataByUsername = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'El campo "id" es requerido.' });
    }

    const foundUser = await userModel.findOne({ _id: id });

    if (foundUser) {
      return res.json(foundUser);
    } else {
      return res
        .status(404)
        .json({ error: "No se encontraron datos del usuario." });
    }
  } catch (error) {
    return res.status(500).json({ error: "Ocurrió un error en el servidor." });
  }
};

userCtrl.getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res
        .status(400)
        .json({ error: 'El campo "username" es requerido.' });
    }

    const foundUser = await User.findOne({ username: username });

    if (foundUser) {
      return res.json(foundUser._id);
    } else {
      return res
        .status(404)
        .json({ error: "No se encontraron datos del usuario." });
    }
  } catch (error) {
    return res.status(500).json({ error: "Ocurrió un error en el servidor." + error });
  }
};

userCtrl.validateIdentityAdm = async (req, res) => {
  try {
    const { user } = req.params;
    const numIdentities = await IdentityAdmin.countDocuments({ user: user });
    if (numIdentities >= 2) {
      res.json({ success: false });
    } else {
      res.json({ success: true });
    }
  } catch (error) {
    res.json(error.message);
  }
};

userCtrl.setIdentityAdm = async (req, res) => {
  try {
    const { user, zona } = req.body;
    const newIdentity = await IdentityAdmin.create({ user: user, zona: zona });
    res.json({ identity: newIdentity });
  } catch (error) {
    res.json(error.message);
  }
};

userCtrl.closeIdentityAdm = async (req, res) => {
  try {
    const { identity } = req.params;

    try {
      const deletedIdentity = await IdentityAdmin.deleteOne({ _id: identity });

      if (deletedIdentity.deletedCount === 0) {
        // No se encontró ningún registro que coincida con la consulta
        res.json("No se encontró ningún registro para cerrar la sesión");
      } else {
        // Se eliminó al menos un registro
        res.json("Se ha abierto un espacio para la sesión");
      }
    } catch (error) {
      console.error("Error converting to ObjectId:", error);
    }
  } catch (error) {
    res.json(error.message);
  }
};

userCtrl.deleteIdentityAdm = async (req, res) => {
  try {
    const { user } = req.params;
    const deletedIdenties = await IdentityAdmin.deleteMany({ user: user });
    if (deletedIdenties.deletedCount === 0) {
      // No se encontró ningún registro que coincida con la consulta
      res.json("No se encontró ningún usuario para eliminar sesión");
    } else {
      // Se eliminó un registro
      res.json("se han eliminado las sesiones");
    }
  } catch (error) {
    res.json(error.message);
  }
};

userCtrl.deleteOneIdentityAdm = async (req, res) => {
  try {
    const { identity } = req.params;
    const deletedIdenties = await IdentityAdmin.deleteOne({ _id: identity });
    if (deletedIdenties.deletedCount === 0) {
      // No se encontró ningún registro que coincida con la consulta
      res.json("No se encontró ninguna sesión para eliminar");
    } else {
      // Se eliminó un registro
      res.json("se ha eliminado la sesiones");
    }
  } catch (error) {
    res.json(error.message);
  }
};

userCtrl.getIdentitiesAdm = async (req, res) => {
  try {
    const { user } = req.params;

    const objectId = new mongoose.Types.ObjectId(user);
    let usuario = await User.findOne({ _id: user });

    let zonas = [];
    if (usuario.role == "super administrativo") {
      let aux = await Zona.find({});
      for (let i = 0; i < aux.length; i++) {
        zonas.push(Types.ObjectId(aux[i]._id));
      }
    } else {
      for (let i = 0; i < usuario.zonas.length; i++) {
        zonas.push(Types.ObjectId(usuario.zonas[i]));
      }
    }

    const identities = await IdentityAdmin.find({
      zona: { $in: zonas },
    }).lean();

    const selectedData = await Promise.all(
      identities.map(async (identity) => {
        const userObj = await User.findOne({ _id: identity.user }).lean();
        const zonaObj = await Zona.findOne({ _id: identity.zona }).lean();

        return {
          _id: identity._id,
          user: identity.user,
          zona: identity.zona,
          fecha: identity.createdAt,
          username: userObj.username,
          zonaname: zonaObj.name,
        };
      })
    );

    res.json(selectedData);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

userCtrl.findNumberIdentities = async (req, res) => {
  try {
    const { identity } = req.params;

    const identities = await IdentityAdmin.countDocuments({ _id: identity });
    const identitiesData = await IdentityAdmin.find({ _id: identity });

    let now = new Date();
    let sessionExpired = false;

    for (let identity of identitiesData) {
      let createdAt = new Date(identity.createdAt);
      let timeDifference = now - createdAt;
      let hoursDifference = timeDifference / (1000 * 60 * 60);

      if (hoursDifference >= 12) {
        sessionExpired = true;
        break; // Si se encuentra una identidad con más de 24 horas, no es necesario seguir buscando
      }
    }

    let response = {
      identities,
      sessionExpired,
    };

    res.json(response);
  } catch (error) {
    console.error("Error en findNumberIdentities:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};



module.exports = userCtrl;
