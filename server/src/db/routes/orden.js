const express = require("express");
const router = express.Router();
const { Orden, ItemOrden } = require("../models"); // Asegúrate de que los modelos estén correctamente importados

// Crear una nueva orden
router.post("/", async (req, res) => {
  const {
    usuarioId,
    direccion,
    ciudad,
    departamento,
    codigoPostal,
    telefono,
    items,
    total,
  } = req.body;

  try {
    // Combinar los campos de dirección en uno solo
    const direccionEnvio = `${direccion}, ${ciudad}, ${departamento}, ${codigoPostal}`;

    // Crear la orden en la base de datos
    const nuevaOrden = await Orden.create({
      usuarioId,
      direccionEnvio,
      metodoPago: "No especificado", // Opcional: puedes añadir esto al formulario si lo necesitas
      metodoEnvio: "No especificado", // Opcional: puedes añadir esto al formulario si lo necesitas
      estado: "Pendiente",
      total,
    });

    // Crear los items de la orden
    const itemsOrden = items.map((item) => ({
      ordenId: nuevaOrden.id,
      productoId: item.productoId,
      cantidad: item.cantidad,
      precioUnitario: item.precio,
    }));

    await ItemOrden.bulkCreate(itemsOrden);

    res.status(201).json(nuevaOrden);
  } catch (error) {
    console.error("Error al crear la orden:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
