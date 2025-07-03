const express = require("express");
const router = express.Router();
const { ItemCarrito, Producto } = require("../models");

// GET /api/carrito/:usuarioId → Obtener productos del carrito
// GET /api/carrito/:usuarioId → Obtener productos del carrito
router.get("/:usuarioId", async (req, res) => {
  try {
    const items = await ItemCarrito.findAll({
      where: { usuarioId: req.params.usuarioId, guardado: false },
      include: { model: Producto }, // ← Sin attributes
    });
    res.json(items);
  } catch (err) {
    console.error("Error al obtener el carrito:", err);
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
});

// GET /api/carrito/:usuarioId/guardados → Obtener guardados
router.get("/:usuarioId/guardados", async (req, res) => {
  try {
    const items = await ItemCarrito.findAll({
      where: { usuarioId: req.params.usuarioId, guardado: true },
      include: { model: Producto }, // ← Sin attributes
    });
    res.json(items);
  } catch (err) {
    console.error("Error al obtener guardados:", err);
    res.status(500).json({ error: "Error al obtener guardados" });
  }
});

// POST /api/carrito → Agregar producto al carrito
router.post("/", async (req, res) => {
  try {
    const { usuarioId, productoId, cantidad } = req.body;
    const item = await ItemCarrito.create({
      usuarioId,
      productoId,
      cantidad,
      guardado: false,
    });
    res.status(201).json(item);
  } catch (err) {
    console.error("Error al agregar producto al carrito:", err);
    res.status(500).json({ error: "Error al agregar producto al carrito" });
  }
});

// PUT /api/carrito/:id → Actualizar cantidad
router.put("/:id", async (req, res) => {
  try {
    const item = await ItemCarrito.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: "No encontrado" });
    item.cantidad = req.body.cantidad;
    await item.save();
    res.json(item);
  } catch (err) {
    console.error("Error al actualizar cantidad:", err);
    res.status(500).json({ error: "Error al actualizar cantidad" });
  }
});

// PUT /api/carrito/:id/guardar → Marcar como guardado
router.put("/:id/guardar", async (req, res) => {
  try {
    const item = await ItemCarrito.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: "No encontrado" });
    item.guardado = true;
    await item.save();
    res.json(item);
  } catch (err) {
    console.error("Error al guardar producto:", err);
    res.status(500).json({ error: "Error al guardar producto" });
  }
});

// DELETE /api/carrito/:id → Eliminar ítem
router.delete("/:id", async (req, res) => {
  try {
    const item = await ItemCarrito.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: "No encontrado" });
    await item.destroy();
    res.status(204).end();
  } catch (err) {
    console.error("Error al eliminar producto del carrito:", err);
    res.status(500).json({ error: "Error al eliminar producto del carrito" });
  }
});

module.exports = router;
