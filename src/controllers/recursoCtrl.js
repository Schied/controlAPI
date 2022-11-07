const fs = require("fs");
const { Pool } = require("pg");
const keys = require("../util/keys");
const url = require("url");
const params = url.parse(keys.DB);
const auth = params.auth.split(":");

const pool = new Pool({
  user: auth[0],
  password: auth[1],
  host: params.hostname,
  port: params.port,
  database: params.pathname.split("/")[1],
  ssl: true,
});

const URL_BASE = "https://app-controljf.herokuapp.com/";

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

exports.getByEquipo = (req, res) => {
  let { Id_equipo } = req.params;
  try {
    const response = pool.query(
      `SELECT * FROM recurso WHERE Id_equipo = ${Id_equipo}`
    );
    if (response.rowCount > 0) {
      res.status(201).send({ success: true, body: response.rows });
    } else {
      res
        .status(404)
        .send({ success: true, body: { message: "No hay recursos" } });
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
  res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
  res.status(200).send({ success: true, url: `http://localhost:3000/${name}` });*/
  var file = fs.readFileSync("./uploads/" + name);
  res.setHeader("Content-Type", "application/pdf");
  res.send(file);
};

exports.deleteRecurso = async (req, res) => {
  let { Id_recurso } = req.body;
  let ruta = await pool.query(
    `SELECT * FROM recurso WHERE Id_recurso = ${Id_recurso}`
  );
  const response = await pool.query(
    `DELETE FROM recurso WHERE Id_recurso = ${Id_recurso}`
  );
  console.log(response);
  if (response.rowCount > 0) {
    fs.unlink("./uploads/" + ruta[0].NombreF_recurso, (err) => {
      if (err) {
        throw err;
      }
      console.log("Delete File successfully.");
    });
    res.status(200).send({
      success: true,
      body: {
        message: "Recurso eliminado exitosamente",
      },
    });
  } else {
    res.status(404).send({
      success: true,
      body: {
        message: "No se ha eliminado ningun recurso",
      },
    });
  }
};
