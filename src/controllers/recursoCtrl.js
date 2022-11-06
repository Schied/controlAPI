const fs = require('fs');

exports.subir = async (req, res) => {
  console.log(req.file);
  res.send("Archivo recibido exitosamente");
};

exports.ver = (req, res) => {
  let { name } = req.params;
  let file = fs.createReadStream('./uploads/'+name);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=quote.pdf");
  file.pipe(res);
};
