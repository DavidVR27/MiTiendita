const express = require("express");
const router = express.Router();
const { Producto } = require("../models");

router.get("/", async (req, res) => {
  try {
    const productos = await Producto.findAll({ where: { activo: true } });
    res.json(productos);
  } catch (err) {
    console.error("Error al obtener productos:", err);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

module.exports = router;
