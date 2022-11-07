const {Router} = require('express');
const router = Router();
const recursoCtrl = require('../controllers/recursoCtrl');


router.post('/', recursoCtrl.subir);
router.get('/', recursoCtrl.getAll);
router.get('/:Id_equipo', recursoCtrl.getByEquipo);
router.delete('/', recursoCtrl.deleteRecurso);

module.exports = router;

