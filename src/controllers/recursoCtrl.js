const fs = require("fs");
const { Pool } = require("pg");
const keys = require("../util/keys");
const url = require("url");
const params = url.parse(keys.DB);
const auth = params.auth.split(":");
const os = require('os');
const dropboxV2Api = require('dropbox-v2-api');

const dropbox = dropboxV2Api.authenticate({
  token: 'sl.BSwI5w5Uw-TSqJtI1Iolc0hgN89YRMEbkQbYwtbLBgFggVHmWvMctKgf8regJ9dEgik9kkzERhkCQWwcTVz86LZwhBp7E-B9tE5JD0ezncwJGBKTfZNWLLvILMFC-1FnhTd8WsdbjI72'
});

const pool = new Pool({
  user: auth[0],
  password: auth[1],
  host: params.hostname,
  port: params.port,
  database: params.pathname.split("/")[1],
  ssl: true,
});

const URL_BASE = "https://app-controljf.herokuapp.com/";

exports.funcionaporfavor = (req, res) => { 
    const downloadStream = dropbox({
        resource: 'files/download',
        parameters: { path: '/1ece86ec1e152e934626d9a1b0cd7e34' }
    });
    res.setHeader('Content-type', 'application/pdf');   
    downloadStream.pipe(res);
}

exports.subir = async (req, res) => {
  let { Nombre_recurso, Id_equipo } = req.body;
  try {
    const response = await pool.query(
      `INSERT INTO recurso(Nombre_recurso, Valor_recurso, NombreF_recurso, Id_equipo) VALUES ($1, $2, $3, $4)`,
      [
        Nombre_recurso,
        URL_BASE + req.file.filename,
        req.file.filename,
        Id_equipo,
      ]
    );
    console.log(response);
    res.status(201).send({
      success: true,
      body: {
        message: "Recurso creado",
      },
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      body: {
        message: "No se ha podido crear el equipo",
        error,
      },
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    const response = await pool.query(`SELECT * FROM recurso`);
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

exports.getByEquipo = async (req, res) => {
  let { Id_equipo } = req.params;
  try {
    const response = await pool.query(
      `SELECT * FROM recurso WHERE Id_equipo = ${Id_equipo}`
    );
    if (response.rowCount > 0) {
      res.status(201).send({ success: true, body: response.rows });
    } else {
      res
        .status(404)
        .send({ success: true, body: [] });
    }
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

exports.verURL = (req, res) => {
  let { name } = req.params;
  /*res.setHeader('Content-Type', 'application/pdf');
  res.status(200).send({ success: true, url: `http://localhost:3000/${name}` })*/
  var file = fs.readFileSync("./uploads/" + name);
  res.setHeader("Content-Type", "application/pdf");
  res.send(file);
};


exports.actualizarRecurso = async (req, res) => {
  let { Id_recurso } = req.body;
  let urlFinal = URL_BASE + req.file.filename;
  let ruta = await pool.query(
    `SELECT * FROM recurso WHERE Id_recurso = ${Id_recurso}`
  );
  const response = await pool.query(
    `UPDATE recurso SET valor_recurso = '${urlFinal}', nombref_recurso = '${req.file.filename}' WHERE Id_recurso = ${ruta.rows[0].id_recurso}`
  );
  if (response.rowCount > 0) {
    try {
      fs.unlink("./uploads/" + ruta.rows[0].nombref_recurso, (err) => {
        if (err) {
          throw err;
        }
        console.log("Update File successfully.");
      });
    } catch (error) {
      console.log("Update File failed." + error);
    }
    
    res.status(200).send({
      success: true,
      body: {
        message: "Recurso actualizado exitosamente",
      },
    });
  } else {
    res.status(404).send({
      success: true,
      body: {
        message: "No se ha actualizado ningun recurso",
      },
    });
  }
};
