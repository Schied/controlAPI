const pool = require('../util/repository_postgre');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
    const { Codigo_usu, Nombre_usu, Correo_usu, Contra_usu, Rol_usu } = req.body;
    const pswHash = bcrypt.hashSync(Contra_usu, 10);
    const response = await pool.query(`INSERT INTO usuario VALUES ($1, $2, $3, $4, $5)`, [Codigo_usu, Nombre_usu, Correo_usu, pswHash, Rol_usu]);
    console.log(response);
    res.status(201).send({
        success: true,
        body: {
            Codigo_usu, 
            Nombre_usu, 
            Correo_usu, 
            Contra_usu, 
            Rol_usu
        }
    })
}