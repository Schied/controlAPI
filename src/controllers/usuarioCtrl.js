const mysql = require('mysql');
const bcrypt = require('bcrypt');

const pool  = mysql.createPool({
  host            : 'localhost',
  user            : 'root',
  database        : 'controljf_db'
});
exports.createUser = async (req, res) => {
    const { Codigo_usu, Nombre_usu, Correo_usu, Contra_usu, Rol_usu } = req.body;
    const pswHash = bcrypt.hashSync(Contra_usu, 10);
    pool.query(`INSERT INTO usuario VALUES (?, ?, ?, ?, ?)`, [Codigo_usu, Nombre_usu, Correo_usu, pswHash, Rol_usu], (err, results) => {
        if (err) return res.status(500).send({success: false, body: err});
        res.status(201).send({success: true, body: results});
    });
}