const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3000;
require("dotenv").config();

const db = require("./src/db/models");

// Middleware
app.use(bodyParser.json());

// Aquí conectas tu ruta del carrito ✅
app.use("/api/carrito", require("./src/db/routes/carrito"));

// Inicia servidor y sincroniza base de datos
db.sequelize.sync().then(() => {
  console.log("Base de datos sincronizada");
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
});
