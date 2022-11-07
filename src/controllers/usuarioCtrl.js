const mysql = require('mysql');
const bcrypt = require('bcrypt');

const { Pool } = require('pg');
const keys = require('../util/keys');
const url = require('url');
const params = url.parse(keys.DB2);
const auth = params.auth.split(':');

const pool2 = new Pool({
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: true
});

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

exports.create = async (req, res) => {
  const {username, name, password, email} = req.body;
  const pswHash = bcrypt.hashSync(password, 10);
  const response = await pool2.query(`INSERT INTO users (username, name, password, email) VALUES ($1, $2, $3, $4)`, [username, name, pswHash, email]);
  console.log(response);
  res.status(201).json({
      message: 'Created',
      body: {
          user:{
              username, 
              name, 
              email
          }
      }
  })
}