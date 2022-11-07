const {Router} = require('express');
const router = Router();
const equipoCtrl = require('../controllers/equipoCtrl');


router.get('/', equipoCtrl.getAll);
router.post('/', equipoCtrl.createEquipo);


module.exports = router;
