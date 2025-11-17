const Abonos = require("../models/abonos.model");
const mongoose = require("mongoose");

abonosCtrl = {};

abonosCtrl.get = async (req, res) => {
  try {
    const abonos = await Abonos.find();
    res.status(200).json(abonos);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

abonosCtrl.getAbonosById = async (req, res) => {
  try {
    let results = await Abonos.aggregate([
      {
        $match: {
          compra: mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $lookup: {
          from: "zonas",
          localField: "zona_pago",
          foreignField: "_id",
          as: "zonaInfo",
        },
      },
      {
        $lookup: {
          from: "sucursals",
          localField: "sucursal",
          foreignField: "_id",
          as: "sucursalInfo",
        },
      },
      {
        $lookup: {
          from: "tipos",
          localField: "tipo",
          foreignField: "_id",
          as: "tipoInfo",
        },
      },
      {
        $lookup: {
          from: "subtipos",
          localField: "subtipo",
          foreignField: "_id",
          as: "subtipoInfo",
        },
      },
      {
        $project: {
          _id: 1,
          zona_pago: { $arrayElemAt: ["$zonaInfo", 0] },          // zona: 1,
          sucursal: { $arrayElemAt: ["$sucursalInfo", 0] }, 
          fecha: 1,
          tipo: { $arrayElemAt: ["$tipoInfo", 0] }, 
          subtipo: { $arrayElemAt: ["$subtipoInfo", 0] }, 
          descripcion: 1,
          total_efectivo: 1,
          total_tarjeta: 1,
          documento: 1,
        },
      },
      {
        $sort: {
          fecha: -1,
        },
      },
    ]);

    res.status(200).json(results);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

abonosCtrl.getMontoAbonosId = async (req, res) => {
  try {
    let restante = await Abonos.aggregate([
      {
        $match: {
          compra: mongoose.Types.ObjectId(req.params.id)
        }
      },
      {
        $group: { 
          _id: "$compra", 
          totalAbonos: { $sum: { $add: ["$total_efectivo", "$total_tarjeta"] } }
        }
      },
      {
        $sort: {
          fecha: -1,
        },
      },
    ]);

    res.status(200).json(restante)
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

abonosCtrl.getAllAbonos = async (req, res) => {
  try {
    const compras = req.body;

    const results = await Promise.all(
      compras.map(async (compra) => {
        const result = await Abonos.aggregate([
          {
            $match: {
              compra: mongoose.Types.ObjectId(compra),
            },
          },
          {
            $group: {
              _id: "$compra",
              totalAbonos: {  $sum:  { $add: ["$total_efectivo", "$total_tarjeta"] } },
            },
          },
          {
            $sort: {
              fecha: -1,
            },
          },
        ]);

        return result[0];
      })
    );

    const resultsFiltered = results.filter(
      (elemento) => elemento !== undefined
    );
    res.status(200).json(resultsFiltered);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

abonosCtrl.create = async (req, res) => {
  try {
    console.log(req.body);
    let data = {
      compra: req.body.compra,
      zona_pago: req.body.zona_pago,
      sucursal: req.body.sucursal,
      fecha: req.body.fecha,
      tipo: req.body.tipo,
      subtipo: req.body.subtipo,
      descripcion: req.body.descripcion,
      total_efectivo: req.body.total_efectivo,
      total_tarjeta:  req.body.total_tarjeta,
      documento: req.body.documento,
    };

    let abono = new Abonos(data);
    abono = await abono.save();

    res.status(200).json(abono);
  } catch (error) {
    res.status(500).json(error);
  }
};

abonosCtrl.edit = async (req, res) => {
  try {
    let data = {
      compra: req.body.compra,
      zona_pago: req.body.zona_pago,
      sucursal: req.body.sucursal,
      fecha: req.body.fecha,
      tipo: req.body.tipo,
      subtipo: req.body.subtipo,
      descripcion: req.body.descripcion,
      total_efectivo: req.body.total_efectivo,
      total_tarjeta:  req.body.total_tarjeta,
      documento: req.body.documento,
    };

    let abono = await Abonos.findById(req.params.id);
    if (!abono) {
      res.status(500).json({ message: "abono no encontrado" });
    }

    abono = await Abonos.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });

    res.status(200).json(abono);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

abonosCtrl.delete = async (req, res) => {
  try {
    let abono = await Abonos.findById(req.params.id);
    if (!abono) {
      return res.status(404).json({ message: "Abono no encontrado" });
    }

    abono = await Abonos.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "abono eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

module.exports = abonosCtrl;
