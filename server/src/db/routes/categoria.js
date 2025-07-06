const express = require("express");
const router = express.Router();
const { Categoria, Producto } = require("../models");

// GET: Obtener todas las categorías
router.get("/", async (req, res) => {
  try {
    const categorias = await Categoria.findAll({ include: Producto });
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener categorías" });
  }
});

// POST: Crear nueva categoría
router.post("/", async (req, res) => {
  try {
    const { nombre } = req.body;
    const nuevaCategoria = await Categoria.create({ nombre });
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    res.status(500).json({ error: "Error al crear categoría" });
  }
});

// PUT: Editar categoría
router.put("/:id", async (req, res) => {
  try {
    const { nombre } = req.body;
    const categoria = await Categoria.findByPk(req.params.id);
    if (!categoria) return res.status(404).json({ error: "Categoría no encontrada" });

    categoria.nombre = nombre;
    await categoria.save();
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ error: "Error al editar categoría" });
  }
});

// POST: Agregar producto a una categoría
router.post("/:id/agregar-producto", async (req, res) => {
  try {
    const { productoId } = req.body;
    const categoria = await Categoria.findByPk(req.params.id);
    const producto = await Producto.findByPk(productoId);

    if (!categoria || !producto) return res.status(404).json({ error: "Datos no encontrados" });

    await categoria.addProducto(producto); // relación N:M
    res.json({ mensaje: "Producto agregado a la categoría" });
  } catch (error) {
    res.status(500).json({ error: "Error al asignar producto" });
  }
});

module.exports = router;
