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

exports.getActivos = async (req, res) => {
  try {
    const response = await pool.query(`SELECT * FROM equipo WHERE Estado_equipo = true`);
    res.status(201).send({ success: true, body: response.rows });
  } catch (error) {
    res.status(500).send({
      success: false,
      body: {
        message: "No se ha podido cargar los recursos",
        error,
      },
    });
  }
};

exports.getInactivos = async (req, res) => {
  try {
    const response = await pool.query(`SELECT * FROM equipo WHERE Estado_equipo = false`);
    res.status(201).send({ success: true, body: response.rows });
  } catch (error) {
    res.status(500).send({
      success: false,
      body: {
        message: "No se ha podido cargar los recursos",
        error,
      },
    });
  }
};


exports.createEquipo = async (req, res) => {
    const { Nombre_equipo, Area_equipo, Marca_equipo, Modelo_equipo, Serial_equipo, Num_placa_equipo } = req.body;
    try {
      const response = await pool.query(`INSERT INTO equipo(Nombre_equipo, Area_equipo, Marca_equipo, Modelo_equipo, Serial_equipo, Num_placa_equipo) VALUES ($1, $2, $3, $4, $5, $6)`, [Nombre_equipo, Area_equipo, Marca_equipo, Modelo_equipo, Serial_equipo, Num_placa_equipo]);
      res.status(201).send({
        success: true,
        body: {
          message: "Equipo creado"
        }
      })
    } catch (error) {
      res.status(500).send({
        success: false,
        body: {
          message: "No se ha podido crear el equipo",
          error
        }
      })
    }
}

exports.desactivarEquipo = async (req, res) => {
  const { Id_equipo } = req.body;
  try {
    const response = await pool.query(`UPDATE equipo SET estado_equipo = false WHERE id_equipo = ${Id_equipo}`);
    if (response.rowCount > 0) {
      res.status(201).send({ success: true, body: {message: 'Equipo desactivado'} });
    } else {
      res
        .status(404)
        .send({ success: false, body: {message: 'No se ha desactivado el equipo'} });
    }    
  } catch (error) {
    res.status(500).send({
      success: false,
      body: {
        message: "No se ha podido desactivar el equipo",
        error
      }
    })
  }
}

