const bcrypt = require('bcrypt');

const { Pool } = require('pg');
const keys = require('../util/keys');
const url = require('url');
const params = url.parse(keys.DB);
const auth = params.auth.split(':');

const pool = new Pool({
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: true
});

exports.createUser = async (req, res) => {
  const {Codigo_usu, Nombre_usu, Correo_usu, Contra_usu, Rol_usu} = req.body;
  const pswHash = bcrypt.hashSync(Contra_usu, 10);
  const response = await pool.query(`INSERT INTO usuario (Codigo_usu, Nombre_usu, Correo_usu, Contra_usu, Rol_usu) VALUES ($1, $2, $3, $4, $5)`, [Codigo_usu, Nombre_usu, Correo_usu, pswHash, Rol_usu]);
  console.log(response);
  res.status(201).json({
      message: 'Created',
      body: {
          user:{
            Codigo_usu, Nombre_usu, Correo_usu, Rol_usu
          }
      }
  })
}

exports.find = async (req, res, next) => {
    const correo = req.body.Correo_usu;
    try {
        const response = await pool.query(`SELECT * FROM usuario WHERE Correo_usu = '${correo}'`);
        if(response.rowCount>0){
            req.body.users = response.rows;
        }
        next();
    } catch (error) {
        return res.status(500).send({success: false, body: error});
    }
}

exports.signin = async (req, res) => {
    if (!req.body.users) return res.status(404).send({ success: false, body: {message: 'Usuario no existe'} });
    let user = req.body.users[0];
    const match = await bcrypt.compare(req.body.Contra_usu, user.contra_usu);
    if (match) {
        res.status(200).send({ success: true, body: {message: 'Credenciales validas'} })
    } else {
        res.status(403).send({ success: false, body: {message: 'Credenciales invalidas'} })
    }
}

