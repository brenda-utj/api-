const express = require('express');
const router = express.Router();
const pos = require('../controllers/pos.controller');

router.get('/list/:id/:date', pos.list);
router.get('/sales/:datefrom/:dateto/:zona/:sucursal', pos.sales);
router.get('/status/:zona/:sucursal', pos.status);
router.get('/statusPM/:zona/:sucursal', pos.statusPM);
router.get('/status-detail/:fecha/:sucursal', pos.statusDetail);
router.get('/history-by-range/:sucursal/:datefrom/:dateto', pos.historyByRange);
router.get('/inventory-movements-by-range/:zona/:sucursal/:product/:datefrom/:dateto', pos.inventoryMovementsByRange);
router.get('/status-v2/:sucursal/:datefrom/:dateto', pos.statusv2);

router.get('/product-inv-movs-summary/:zona/:sucursal/:datefrom/:dateto/:product', pos.productInvMovsSummary);
router.get('/materia-inv-movs-summary/:zona/:sucursal/:datefrom/:dateto/:materia', pos.materiaInvMovsSummary);

router.get('/moneybox-movements-by-range/:sucursal/:datefrom/:dateto', pos.moneyMovementsByRange);
router.get('/history/:id', pos.history);
//NOTE - Nueva ruta para analisis de venta por sucursal
router.get('/range-branch/:zona/:sucursal/:datefrom/:dateto', pos.rangeBranch);
router.get('/range/:zona/:sucursal/:datefrom/:dateto', pos.range);
router.get('/analisis-range/:zona/:sucursal/:datefrom/:dateto', pos.analisisRange);
router.get('/one/:id', pos.one);
router.post('/new', pos.create);


router.get('/report3pm/:type/:id', pos.report3pm);
router.get('/productAnalisis/:zona/:sucursal/:datefrom/:dateto/:product/:subtipo', pos.productAnalisis);
router.get('/hour',pos.getHour);
router.get('/resume/:zona/:datefrom/:dateto/:user', pos.resume)

//router.get('/proyeccion', proyeccion.proyeccion)
router.get('/proyeccion/:branch_id', pos.proyeccion)

module.exports = router;