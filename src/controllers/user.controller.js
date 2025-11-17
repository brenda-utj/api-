const User = require("../models/user.model");
const Sucursal = require("../models/sucursal.model");
const Identity = require("../models/identity.model");
const IdentityAdmin = require("../models/identityadmin.model");
const jwt = require("jsonwebtoken");
const keys = require("../utils/keys");
const bcrypt = require("bcryptjs");
const Pusher = require("pusher");
const mongoose = require("mongoose");
const { Schema, Types } = mongoose;
const bodyParser = require("body-parser");
let pusher = new Pusher(keys.pusher);
let Authorization = require("../models/authorization.model");
const userModel = require("../models/user.model");
const identityadmin = require("../models/identityadmin.model");
const Zona = require("../models/zona.model");

require("dotenv").config();

const userCtrl = {};

userCtrl.signUp = async (req, res) => {
  try {
    let data = req.body;
    data["userAdd"] = req.params.userMov;

    const { name, lastname, email, username, password, role } = req.body;
    let userInstance = new User(data);
    userInstance.password = await userInstance.hashPassword(password);
    userInstance.username = username.toLowerCase();
    const user = await userInstance.save();
    const token = jwt.sign(user.toJSON(), keys.secret);
    res.json({
      message: "Signup successful",
      user,
      token
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

userCtrl.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({
      username: username.toLowerCase(),
      activo: 1
    });
    if (!user) {
      res.status(404).send({
        message: "El usuario no existe y/o esta inactivo"
      });
    } else {
      const validation = await user.isValidPassword(password, user);
      if (!validation) {
        res.status(404).send({
          message: "Contrseña incorrecta"
        });
      } else {
        const token = jwt.sign(user.toJSON(), keys.secret);
        res.json({
          message: "Logged In",
          user,
          token
        });
      }
    }
  } catch (error) {
    res.json(error.message);
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

userCtrl.getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res
        .status(400)
        .json({ error: 'El campo "username" es requerido.' });
    }

    const foundUser = await userModel.findOne({ username: username });

    if (foundUser) {
      return res.json(foundUser._id);
    } else {
      return res
        .status(404)
        .json({ error: "No se encontraron datos del usuario." });
    }
  } catch (error) {
    return res.status(500).json({ error: "Ocurrió un error en el servidor." });
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

userCtrl.getZoneByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res
        .status(400)
        .json({ error: 'El campo "username" es requerido.' });
    }

    const foundUser = await userModel.findOne({ username: username });

    if (foundUser) {
      return res.json(foundUser.zona);
    } else {
      return res
        .status(404)
        .json({ error: "No se encontraron datos del usuario." });
    }
  } catch (error) {
    return res.status(500).json({ error: "Ocurrió un error en el servidor." });
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
      sessionExpired
    };

    res.json(response);
  } catch (error) {
    console.error("Error en findNumberIdentities:", error);
    res.status(500).json({ error: "Error en el servidor" });
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

    if (!user) {
      return res.status(400).json({ message: "Falta el parámetro 'user'" });
    }

    const objectId = new mongoose.Types.ObjectId(user.toString());
    const usuario = await User.findById(objectId);

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    let zonas = [];

    if (usuario.role === "super administrativo") {
      const aux = await Zona.find({});
      zonas = aux.map(z => new mongoose.Types.ObjectId(z._id.toString()));
    } else {
      if (
        !usuario.zonas ||
        !Array.isArray(usuario.zonas) ||
        usuario.zonas.length === 0
      ) {
        return res
          .status(400)
          .json({ message: "El usuario no tiene zonas asignadas" });
      }

      zonas = usuario.zonas.map(
        zid => new mongoose.Types.ObjectId(zid.toString())
      );
    }

    const identities = await IdentityAdmin.find({
      zona: { $in: zonas }
    }).lean();

    const selectedData = await Promise.all(
      identities.map(async identity => {
        const userObj = await User.findById(identity.user).lean();
        const zonaObj = await Zona.findById(identity.zona).lean();

        return {
          _id: identity._id,
          user: identity.user,
          zona: identity.zona,
          fecha: identity.createdAt,
          username: userObj ? userObj.username : "N/A",
          zonaname: zonaObj ? zonaObj.name : "N/A"
        };
      })
    );

    return res.json(selectedData);
  } catch (error) {
    console.error("Error en getIdentitiesAdm:", error);
    return res.status(500).json({ message: error.message });
  }
};

userCtrl.verify = async (req, res) => {
  try {
    const token = req.headers.token;
    const decodedToken = await jwt.verify(token, keys.secret);
    const user = await User.findOne({ username: decodedToken.username });
    res.json({ user, token });
  } catch (error) {
    res.json(error.message);
  }
};

userCtrl.chooseBranch = async (req, res) => {
  try {
    const { user_id, branch_id } = req.body;
    const identity = await Identity.findOne({ sucursal: branch_id });
    if (identity) {
      res.json({ success: false });
    } else {
      const identityInstance = new Identity({
        usuario: user_id,
        sucursal: branch_id
      });
      await identityInstance.save();
      res.json({ success: true });
    }
  } catch (error) {
    res.json({ success: false });
  }
};

userCtrl.leaveBranch = async (req, res) => {
  try {
    const { user_id, branch_id } = req.body;
    const identity = await Identity.findOne({
      usuario: user_id,
      sucursal: branch_id
    });
    if (identity) {
      await Identity.deleteMany({ usuario: user_id, sucursal: branch_id });
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    res.json({ success: false });
  }
};

userCtrl.canI = async (req, res) => {
  try {
    // const { authkey, branch_id, user_id } = req.body;
    const { authkey, branch_id, details } = req.body;
    const { action } = req.params;

    const branch = await Sucursal.findOne({ _id: branch_id });

    if (branch) {
      const user = await User.findOne({
        authkey: authkey,
        zona: branch.zona,
        activo: 1
      });

      if (user) {
        switch (action) {
          case "endProductionEarly": // Bajar barras
          case "insertStorage": // Entrada en almacén
          case "exportStorage": // Salide en almacén
          case "convertChicken": // Convertir pollo para taco o viceversa
          case "insertChickenStorage": // Ingresar pollo crudo
          case "cancelProduction": // Ya no se usa, pero era para eliminar barras
          case "printPosReport": // Imprimir reporte
          case "cancelSale": // Cancelar ticket
          case "sellACourtesy": // Marcar una venta como cortesia
          case "closeEarly": //Cerrar sesión antes de una hora específica
          case "movInv": // Ajuste inventario
          case "openSecondSession": //Iniciar sesión dos veces en un día
          case "RejectTransfer": // Rechazar trasferencia
          case "SendTransfer": // Enviar traspaso
          case "spend": // Retirar efectivo, solo si se activa en el admin
          case "reprintSale": // Re imprimir ticket
          case "incorrectRemission": // Cuando hay devolución en una remisión
          case "openTicketsDialog": //Abrir módulo de tickets
          case "sendRemission": //Guardar remisiones
          case "openPayRoll": //abrir módulo de nóminas
          case "changeLanguage":
            // let check_zone_roles = ['gerente', 'encargado de zona'];
            // let does_not_check_zone_roles = ['administrativo', 'super administrativo'];

            let check_roles = [
              "gerente",
              "auxiliar de zona",
              "administrativo",
              "super administrativo",
              "supervisor",
              "rh de zona"
            ];

            if (check_roles.indexOf(user.role) != -1) {
              //console.log('success 1 true');
              aut = {
                sucursal: branch_id,
                zona: branch.zona,
                usuario: user._id,
                accion: action,
                clave: authkey
              };
              if (details) {
                aut.detalles = details;
              }

              const authorizationInstance = new Authorization(aut);
              let authorization = await authorizationInstance.save();

              res.json({ success: true, authorizationId: authorization._id });
            } else {
              // console.log('success 3 false');
              res.json({ success: false });
            }
            break;
        }
      } else {
        const users = await User.find({ authkey: authkey, activo: 1 });
        if (users.length > 0) {
          let aux;
          let does_not_check_zone_roles = [
            "administrativo",
            "super administrativo"
          ];
          let success = false;
          for (let i = 0; i < users.length; i++) {
            if (does_not_check_zone_roles.indexOf(users[i].role) != -1) {
              success = true;
              aux = users[i];
              break;
            }
          }

          //console.log('success 4 ', success ? 'true' : 'false');
          aut = {
            sucursal: branch_id,
            zona: branch.zona,
            usuario: aux._id,
            accion: action,
            clave: authkey
          };
          if (details) {
            aut.detalles = details;
          }

          const authorizationInstance = new Authorization(aut);
          let authorization = await authorizationInstance.save();
          res.json({ success: success });
        } else {
          // console.log('success 5 false');
          res.json({ success: false });
        }
      }
    }
  } catch (error) {
    // console.log(error);
    // console.log('success 6 false');
    res.json({ success: false });
  }
};

userCtrl.patchCanI = async (req, res) => {
  try {
    const { authorizationId } = req.params;
    const { tableId, action, details } = req.body;

    // Verificar si los parámetros requeridos están presentes
    if (!authorizationId || !tableId || !action) {
      return res.status(400).json({
        message:
          "Se requieren todos los parámetros: authorizationId, tableId, action"
      });
    }

    // Buscar el registro de Authorization por ID
    const authorization = await Authorization.findById(authorizationId);

    // Verificar si la Authorization existe
    if (!authorization) {
      return res.status(404).json({ message: "Autorización no encontrada" });
    }
    let moduleInfo;
    // Revisar qué acción es y asignar los detalles a la tabla donde se pueden consultar
    switch (action) {
      case "endProductionEarly":
        moduleInfo = "cocina";
        break;
      case "insertStorage":
        moduleInfo = tableId; //casos en que el POS envía un JSON con detalles, en lugar del id
        break;
      case "exportStorage":
        moduleInfo = tableId;
        break;
      case "convertChicken":
        moduleInfo = tableId;
        break;
      case "insertChickenStorage":
        moduleInfo = "almacen";
        break;
      case "cancelProduction":
        moduleInfo = "cocina";
        break;
      case "printPosReport":
        moduleInfo = "reporte";
        break;
      case "cancelSale":
        moduleInfo = "tickets";
        break;
      case "sellACourtesy":
        moduleInfo = "punto de venta";
        break;
      case "closeEarly":
        moduleInfo = "reporte";
        break;
      case "movInv":
        moduleInfo = "almacen";
        break;
      case "openSecondSession":
        moduleInfo = "punto de venta";
        break;
      case "RejectTransfer":
        moduleInfo = "traspasos";
        break;
      case "SendTransfer":
        moduleInfo = "traspasos";
        break;
      case "spend":
        moduleInfo = tableId;
        break;
      case "reprintSale":
        moduleInfo = "tickets";
        break;
      case "incorrectRemission":
        moduleInfo = "remisiones";
        break;
      case "openTicketsDialog":
        moduleInfo = tableId;
        break;
      case "sendRemission":
        moduleInfo = tableId;
        break;
      case "openPayRoll":
        moduleInfo = tableId;
        break;
      case "changeLanguage":
        moduleInfo = "idioma";
        break;
      default:
        break;
    }

    // Si se envián detalles, hace patch en el campo detalles
    if (details) {
      authorization.detalles = details;
    }
    // Realizar el patch en el campo modulo dependiendo de la acción
    if (
      action === "insertStorage" ||
      action === "exportStorage" ||
      action == "convertChicken" ||
      action === "spend" ||
      action === "openTicketsDialog" ||
      action === "sendRemission" ||
      action === "openPayRoll"
    ) {
      authorization.modulo = tableId;
    } else {
      authorization.modulo = tableId + " - " + moduleInfo;
    }

    // Guardar los cambios en la base de datos
    await authorization.save();

    // Obtener el registro actualizado
    const updatedAuthorization = await Authorization.findById(authorizationId);

    // Respuesta exitosa con el objeto actualizado
    res.status(200).json(updatedAuthorization);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

userCtrl.updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      name,
      lastname,
      email,
      username,
      sucursal,
      zona,
      zonas,
      role,
      sucursales,
      authkey
    } = req.body;
    const user = {
      name,
      lastname,
      email,
      username,
      sucursal,
      zona,
      zonas,
      role,
      sucursales,
      authkey
    };

    user["userUpd"] = req.params.userMov;

    const updated = await User.findOneAndUpdate(
      { _id: id },
      { $set: user },
      { new: true }
    );
    pusher.trigger("pos", "user-updated", { updated });
    res.json(updated);
  } catch (error) {
    res.json(error.message);
  }
};

userCtrl.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = req.params.user;
    // const deleted = await User.findOneAndUpdate({ $match: {_id: id} $set: "userDel": user});

    const deleted = await User.findOneAndUpdate(
      { _id: id },
      { $set: { userDel: user, activo: 0 } } // Actualización de las propiedades
    );

    if (deleted) {
      res.json("Usuario eliminado correctamente");
    } else {
      res.status(404).json("Usuario no encontrado");
    }
  } catch (error) {
    res.json(error.message);
  }
};

userCtrl.getUsers = async (req, res) => {
  try {
    let query = { activo: { $ne: 0 } };
    // switch (req.user.role) {
    //   case 'super administrativo':
    //   query = {};
    //   break;
    //   case 'administrativo':
    //   query = {zona: req.user.zona};
    //   break;
    //   case 'encargado de zona':
    //   query = {zona: req.user.zona};
    //   break;
    //   case 'gerente':
    //   query = {zona: req.user.zona};
    //   break;
    //   case 'encargado de sucursal':
    //   query = {sucursal: req.user.sucursal};
    //   break;
    // }
    let userList = [];
    let users = await User.find(query)
      .select(
        "_id name lastname email username role zona zonas sucursales sucursal authkey createdAt credentials"
      )
      .populate("zona", "_id name")
      .populate("sucursal", "_id name")
      .sort({ name: 1 });
    users.forEach(user => {
      if (user._id.toString() !== req.user._id.toString()) {
        userList.push(user);
      }
    });
    res.json(userList);
  } catch (error) {
    res.json(error.message);
  }
};

userCtrl.getAllUserEvenSelf = async (req, res) => {
  try {
    let query = { activo: { $ne: 0 } };
    let users = await User.find(query)
      .select(
        "_id name lastname email username role zona zonas sucursales sucursal authkey createdAt"
      )
      .populate("zona", "_id name")
      .populate("sucursal", "_id name")
      .sort({ name: 1 });

    res.json(users);
  } catch (error) {
    res.json(error.message);
  }
};

userCtrl.getUserSelfByZone = async (req, res) => {
  try {
    let query = { activo: { $ne: 0 }, zona: req.params.zona };
    let users = await User.find(query)
      .select(
        "_id name lastname email username role zona zonas sucursales sucursal authkey createdAt"
      )
      .populate("zona", "_id name")
      .populate("sucursal", "_id name")
      .sort({ name: 1 });

    res.json(users);
  } catch (error) {
    res.json(error.message);
  }
};

//similar al método de arriba, pero aquí también obtienes el usuario logeado
userCtrl.getAllUsers = async (req, res) => {
  try {
    let query = { activo: { $ne: 0 } };

    let users = await User.find(query)
      .select(
        "_id name lastname email username role zona zonas sucursales sucursal authkey createdAt credentials"
      )
      .populate("zona", "_id name")
      .populate("sucursal", "_id name")
      .sort({ name: 1 });

    res.json(users);
  } catch (error) {
    res.json(error.message);
  }
};

userCtrl.getUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    res.json(user);
  } catch (error) {
    res.json(error.message);
  }
};

userCtrl.changePassword = async (req, res) => {
  try {
    const { password } = req.body;
    // console.log('req.params', req.params);
    // console.log('req.body', req.body);
    let pass = await bcrypt.hash(password, 10);
    const user = await User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { password: pass } },
      { new: true }
    );
    // pusher.trigger('pos', 'user-password', { user });
    res.json(user);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

//Se obtienen los usuarios según la zona
userCtrl.getUsersZone = async (req, res) => {
  try {
    const zona = req.params.zone;

    if (!mongoose.Types.ObjectId.isValid(zona)) {
      return res.status(400).json({ message: "ID de zona no válido" });
    }

    const users = await User.aggregate([
      {
        $match: {
          $or: [
            { role: "super administrativo" },
            {
              $and: [
                { role: { $ne: "encargado de sucursal" } },
                {
                  $or: [
                    { zona: new mongoose.Types.ObjectId(zona) }, // ← Verifica esta línea
                    { zonas: zona }
                  ]
                }
              ]
            }
          ]
        }
      },
      {
        $set: {
          usuario: { $concat: ["$name", " ", "$lastname"] }
        }
      },
      {
        $project: {
          _id: 1,
          usuario: 1
        }
      },
      {
        $sort: { usuario: 1 }
      }
    ]);

    res.json(users);
  } catch (error) {
    console.error("Error al obtener usuarios por zona:", error);
    res.status(500).json({ message: error.message });
  }
};

userCtrl.updateCredentials = async (req, res) => {
  try {
    const credentials = req.body;
    const userId = req.params.id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { credentials: credentials },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({
      status: "success",
      message: "Credenciales actualizadas correctamente",
      data: updatedUser
    });
  } catch (error) {
    console.error("Error al actualizar las credenciales:", error);
    res.status(500).json({ message: error.message });
  }
};

userCtrl.getUsersZoneWithBranchManager = async (req, res) => {
  try {
    let zona = req.params.zone;
    let users = await User.aggregate([
      {
        $match: {
          $or: [
            {
              role: "super administrativo"
            },
            {
              $and: [
                {
                  $or: [
                    {
                      zona: new mongoose.Types.ObjectId(zona)
                    },
                    {
                      zonas: {
                        $in: [Types.ObjectId(zona)]
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      },
      {
        $set: {
          usuario: {
            $concat: ["$name", " ", "$lastname"]
          }
        }
      },
      {
        $project: {
          _id: 1,
          usuario: 1
        }
      },
      {
        $sort: {
          usuario: 1
        }
      }
    ]);
    res.json(users);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = userCtrl;
