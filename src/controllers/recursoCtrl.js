const fs = require("fs");
const { Pool } = require("pg");
const keys = require("../util/keys");
const url = require("url");
const params = url.parse(keys.DB);
const auth = params.auth.split(":");
const { Storage, File } = require("megajs");

const pool = new Pool({
  user: auth[0],
  password: auth[1],
  host: params.hostname,
  port: params.port,
  database: params.pathname.split("/")[1],
  ssl: true,
});

const URL_BASE = "https://app-controljf.herokuapp.com/recurso/ver/";


exports.subir = async (req, res) => {
  let { Nombre_recurso, Id_equipo } = req.body;
  const storage = await new Storage({
    email: "freiban1999@outlook.com",
    password: "1193037498fsaq",
  }).ready;
  const file = await storage.upload(
    {
      name: req.file.filename+".pdf",
      size: req.file.size,
    },
    fs.createReadStream(req.file.path)
  ).complete;
  try {
    const response = await pool.query(
      `INSERT INTO recurso(Nombre_recurso, Valor_recurso, NombreF_recurso, Id_equipo) VALUES ($1, $2, $3, $4)`,
      [
        Nombre_recurso,
        URL_BASE + req.file.filename+".pdf",
        req.file.filename+".pdf",
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

exports.verPDF = async (req, res) => {
  const storage = await new Storage({
    email: "freiban1999@outlook.com",
    password: "1193037498fsaq",
  }).ready;
  const file = Object.values(storage.files).find(
    (file) => file.name === req.params.name
  );
  res.setHeader("Content-type", "application/pdf");
  const stream = file.download();
  stream.on("error", (error) => console.error(error));
  stream.pipe(res);
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
      res.status(404).send({ success: true, body: [] });
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
  let urlFinal = URL_BASE + req.file.filename+".pdf";
  const storage = await new Storage({
    email: "freiban1999@outlook.com",
    password: "1193037498fsaq",
  }).ready;
  const file = await storage.upload(
    {
      name: req.file.filename+".pdf",
      size: req.file.size,
    },
    fs.createReadStream(req.file.path)
  ).complete;
  let ruta = await pool.query(
    `SELECT * FROM recurso WHERE Id_recurso = ${Id_recurso}`
  );
  const response = await pool.query(
    `UPDATE recurso SET valor_recurso = '${urlFinal}', nombref_recurso = '${req.file.filename+".pdf"}' WHERE Id_recurso = ${ruta.rows[0].id_recurso}`
  );
  if (response.rowCount > 0) {
    try {
      const file = Object.values(storage.files).find(
        (file) => file.name === ruta.rows[0].nombref_recurso
      );
      const deleted = await file.delete()
    } catch (error) {
      console.log("Update File failed." + error);
    }

    res.status(200).send({
      success: true,
      body: {
        message: "Recurso actualizado exitosamente"
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
