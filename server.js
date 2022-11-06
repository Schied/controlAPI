const express = require('express');
const multer = require('multer');
const cors = require('cors');
const keys = require('./src/util/keys');
const app = express();

//import routes
const recursoRoutes = require('./src/routes/recurso');
const usuarioRoutes = require('./src/routes/usuario');
const equipoRoutes = require('./src/routes/equipo');

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());
app.use(express.static("./uploads"));

app.use(multer({
    storage: multer.diskStorage({
        destination: './uploads/',
        limits: { fileSize: 10 * 1024 * 1024 }, // Maximo 10Mb
        filename: function ( req, file, cb ) {
            cb( null, `${Date.now()}-${file.originalname}`);
        }
    })
}).single('file'));

app.use('/recurso', recursoRoutes);
app.use('/user', usuarioRoutes);
app.use('/equipo', equipoRoutes);

app.listen(keys.PORT, () => {
    console.log("Servidor iniciado en el puerto: "+keys.PORT);
})