const fs = require('fs');
const mysql = require('mysql');

const pool  = mysql.createPool({
  host            : 'localhost',
  user            : 'root',
  database        : 'controljf_db'
});

const URL_BASE = "http://localhost:3000/";

exports.subir = async (req, res) => {
  let { Nombre_recurso, Id_equipo } = req.body;
    pool.query(`INSERT INTO recurso(Nombre_recurso, Valor_recurso, Id_equipo) VALUES (?, ?, ?)`, [Nombre_recurso, URL_BASE + req.file.filename, Id_equipo], (err, results) => {
        if (err) return res.status(500).send({success: false, body: err});
        res.status(201).send({success: true, body: results});
    });
};

exports.getAll = (req, res) => {
  pool.query(`SELECT * FROM recurso`, (err, results) => {
    if (err) return res.status(500).send({success: false, body: err});
    res.status(201).send({success: true, body: results});
});  
};


exports.getByEquipo = (req, res) => {
  let { Id_equipo } = req.params;
  pool.query(`SELECT * FROM recurso WHERE Id_equipo = ?`, [Id_equipo], (err, results) => {
    if (err) return res.status(500).send({success: false, body: err});
    res.status(201).send({success: true, body: results});
});  
};


exports.verURL = (req, res) => {
  let { name } = req.params;
  /*res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
  res.status(200).send({ success: true, url: `http://localhost:3000/${name}` });*/
  var file = fs.readFileSync('./uploads/'+name);
  res.setHeader('Content-Type', 'application/pdf');
  res.send(file);
}
