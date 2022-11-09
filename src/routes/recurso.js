const {Router} = require('express');
const router = Router();
const recursoCtrl = require('../controllers/recursoCtrl');
const multer  = require('multer');
const upload = multer({ dest: os.tmpdir() });

router.post('/', upload.single('file'), recursoCtrl.subir);
router.get('/', recursoCtrl.getAll);
router.get('/ver/:name', recursoCtrl.verPDF);
router.get('/:Id_equipo', recursoCtrl.getByEquipo);
router.put('/', recursoCtrl.actualizarRecurso);

module.exports = router;

