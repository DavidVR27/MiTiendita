const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors");
require("dotenv").config();

const db = require("./src/db/models");

// Middleware para configurar la Política de Seguridad de Contenido (CSP)
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' http://localhost:3000; script-src 'self' 'unsafe-inline';"
  );
  next();
});

// Middleware
app.use(cors()); // Permite solicitudes desde otros dominios
app.use(bodyParser.json());

// Aquí conectas tu ruta del carrito ✅
app.use("/api/carrito", require("./src/db/routes/carrito"));

// Aquí conectas tu ruta de productos ✅
app.use("/api/productos", require("./src/db/routes/producto"));

// Ruta para órdenes
app.use("/api/ordenes", require("./src/db/routes/orden"));

// Ruta para usuarios ✅
app.use("/api/usuarios", require("./src/db/routes/usuario"));

// Inicia servidor y sincroniza base de datos
db.sequelize.sync().then(() => {
  console.log("Base de datos sincronizada");
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
});
