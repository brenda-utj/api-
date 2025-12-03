const Modulo = require("./../models/modulos.model");
const mongoose = require("mongoose");

const modulosCtrl = {};

//CREATE
modulosCtrl.create = async (req, res) => {
  try {
    let moduleData = req.body.data;
    let user = req.body.user;

    moduleData.userAdd = user;
    moduleData.active = true;

    let moduleCreated = new Modulo(moduleData);
    moduleCreated = await moduleCreated.save();

    res.status(200).json(moduleCreated);
  } catch (error) {
    if (error.code === 11000) {
      // Error de índice único duplicado
      return res
        .status(400)
        .json({ message: "El módulo ya existe con ese nombre." });
    }
    console.error(error);
    res.status(500).json({ message: "Error del servidor", error });
  }
};

modulosCtrl.getAll = async (req, res) => {
  try {
    let modules = await Modulo.find({ active: true});    
    res.status(200).json(modules);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

modulosCtrl.update = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body.data;
    const user = req.body.user;

    let module = await Modulo.findById(id);
    if (!module) {
      return res.status(404).json({ message: "Módulo no encontrado." });
    }

    // Actualizar los campos del módulo con los nuevos datos
    module.name = updatedData.name || module.name;
    module.icon = updatedData.icon || module.icon;
    module.displayName = updatedData.displayName || module.displayName;
    module.active =
      updatedData.active !== undefined ? updatedData.active : module.active;
    module.file = updatedData.file || module.file;
    module.position =
      updatedData.position !== undefined
        ? updatedData.position
        : module.position;
    module.credential = updatedData.credential || module.credential;
    module.submodules = updatedData.submodules || module.submodules;
    module.userUpd = user;
    await module.save();

    res
      .status(200)
      .json({ message: "Módulo actualizado exitosamente.", module });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

modulosCtrl.updateView = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body.data;
    const user = req.body.user;
  
    let module = await Modulo.findById(id);
    if (!module) {
      return res.status(404).json({ message: "Módulo no encontrado." });
    }

    // Actualizar los campos del módulo con los nuevos datos
    module.view = req.body.view;
    module.userUpd = user;
    await module.save();

    res
      .status(200)
      .json({ message: "Módulo actualizado exitosamente.", module });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
}

modulosCtrl.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.body; // Se espera que el ID del usuario que realiza la acción sea enviado en el cuerpo de la petición

    let module = await Modulo.findById(id);
    if (!module) {
      return res.status(404).json({ message: "Módulo no encontrado." });
    }

    // Actualizar el módulo
    module.active = false; // Cambiar active a 0 (falso)
    module.userDel = user;

    await module.save();

    res.status(200).json({ message: "Módulo eliminado exitosamente." });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

module.exports = modulosCtrl;
