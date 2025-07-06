const express = require("express");
const router = express.Router();
const { Producto } = require("../models");

// Obtener producto activo
router.get("/", async (req, res) => {
  try {
    const productos = await Producto.findAll({ where: { activo: true } });
    res.json(productos);
  } catch (err) {
    console.error("Error al obtener productos:", err);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// Obtener producto por ID
router.get("/:id", async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(producto);
  } catch (err) {
    console.error("Error al obtener producto:", err);
    res.status(500).json({ error: "Error al obtener producto" });
  }
});

// Crear producto
router.post("/", async (req, res) => {
  try {
    const nuevoProducto = await Producto.create(req.body);
    res.status(201).json(nuevoProducto);
  } catch (err) {
    console.error("Error al crear producto:", err);
    res.status(500).json({ error: "Error al crear producto" });
  }
});

// Editar producto
router.put("/:id", async (req, res) => {
  try {
    const actualizado = await Producto.update(req.body, {
      where: { id: req.params.id }
    });
    if (actualizado[0] === 0) return res.status(404).json({ error: "Producto no encontrado o sin cambios" });
    res.json({ mensaje: "Producto actualizado correctamente" });
  } catch (err) {
    console.error("Error al actualizar producto:", err);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
});

// Desactivar producto
router.patch("/:id/desactivar", async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ error: "Producto no encontrado" });

    producto.activo = false;
    await producto.save();

    res.json({ mensaje: "Producto desactivado" });
  } catch (err) {
    console.error("Error al desactivar producto:", err);
    res.status(500).json({ error: "Error al desactivar producto" });
  }
});

module.exports = router;

