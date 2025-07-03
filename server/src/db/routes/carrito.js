const express = require("express");
const router = express.Router();
const { ItemCarrito, Producto } = require("../models");

// Ver carrito de un usuario
router.get("/:usuarioId", async (req, res) => {
  const carrito = await ItemCarrito.findAll({
    where: { usuarioId: req.params.usuarioId, guardado: false },
    include: Producto,
  });
  res.json(carrito);
});

// Agregar producto al carrito
router.post("/", async (req, res) => {
  const { usuarioId, productoId, cantidad } = req.body;
  const nuevoItem = await ItemCarrito.create({
    usuarioId,
    productoId,
    cantidad,
    guardado: false,
  });
  res.status(201).json(nuevoItem);
});

module.exports = router;
