const {Router} = require('express');
const router = Router();
const usuarioCtrl = require('../controllers/usuarioCtrl');


router.post('/', usuarioCtrl.createUser);

module.exports = router;
