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

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(producto);
  } catch (err) {
    console.error("Error al obtener producto por ID:", err);
    res.status(500).json({ error: "Error al obtener producto" });
  }
});

module.exports = router;
