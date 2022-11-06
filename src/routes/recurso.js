const {Router} = require('express');
const router = Router();
const recursoCtrl = require('../controllers/recursoCtrl');


router.post('/', recursoCtrl.subir);
router.get('/:name', recursoCtrl.ver)

module.exports = router;

