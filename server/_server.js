const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors");
require("dotenv").config();

const db = require("./src/db/models");

// Middleware
app.use(cors()); // Permite solicitudes desde otros dominios
app.use(bodyParser.json());

// Aquí conectas tu ruta del carrito ✅
app.use("/api/carrito", require("./src/db/routes/carrito"));

// Aquí conectas tu ruta de productos ✅
app.use("/api/productos", require("./src/db/routes/producto"));

// Inicia servidor y sincroniza base de datos
db.sequelize.sync().then(() => {
  console.log("Base de datos sincronizada");
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
});
