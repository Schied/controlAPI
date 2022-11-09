const {Router} = require('express');
const router = Router();
const equipoCtrl = require('../controllers/equipoCtrl');


router.get('/activos', equipoCtrl.getActivos);
router.get('/inactivos', equipoCtrl.getInactivos);
router.post('/', equipoCtrl.createEquipo);
router.put('/', equipoCtrl.desactivarEquipo);


module.exports = router;
