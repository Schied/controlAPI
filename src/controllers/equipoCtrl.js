const mysql = require('mysql');

const pool  = mysql.createPool({
  host            : 'localhost',
  user            : 'root',
  database        : 'controljf_db'
});

exports.createEquipo = async (req, res) => {
    const { Nombre_equipo, Area_equipo, Marca_equipo, Modelo_equipo, Serial_equipo, Clasificacion_equipo, Num_placa_equipo } = req.body;
    pool.query(`INSERT INTO equipo(Nombre_equipo, Area_equipo, Marca_equipo, Modelo_equipo, Serial_equipo, Clasificacion_equipo, Num_placa_equipo) VALUES (?, ?, ?, ?, ?, ?, ?)`, [Nombre_equipo, Area_equipo, Marca_equipo, Modelo_equipo, Serial_equipo, Clasificacion_equipo, Num_placa_equipo], (err, results) => {
        if (err) return res.status(500).send({success: false, body: err});
        res.status(201).send({success: true, body: results});
    });
}