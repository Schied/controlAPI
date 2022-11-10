const {Router} = require('express');
const router = Router();
const usuarioCtrl = require('../controllers/usuarioCtrl');


router.post('/', usuarioCtrl.createUser);
router.post('/auth/', usuarioCtrl.find, usuarioCtrl.signin);
router.post('/verifyToken', usuarioCtrl.verifyToken);
module.exports = router;
