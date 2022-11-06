const {Router} = require('express');
const router = Router();
const equipoCtrl = require('../controllers/equipoCtrl');


router.post('/', equipoCtrl.createEquipo);

module.exports = router;
