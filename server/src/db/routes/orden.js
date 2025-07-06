const express = require("express");
const router = express.Router();
const { Orden, ItemOrden, Producto } = require("../models");

// Obtener todas las órdenes de un usuario
router.get("/usuario/:usuarioId", async (req, res) => {
  const { usuarioId } = req.params;
  try {
    const ordenes = await Orden.findAll({
      where: { usuarioId },
      include: [
        {
          model: ItemOrden,
          as: "items",
          include: [
            {
              model: Producto,
              as: "producto",
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(ordenes);
  } catch (error) {
    console.error("Error al obtener las órdenes:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Crear una nueva orden
router.post("/", async (req, res) => {
  console.log("📦 [Ordenes] Datos recibidos en backend:", req.body); // DEBUG

  const {
    usuarioId,
    direccion,
    ciudad,
    departamento,
    codigoPostal,
    telefono,
    metodoPago,
    estado,
    total,
    items,
  } = req.body;

  try {
    // Validaciones básicas
    if (!usuarioId) {
      console.log("❌ [Ordenes] Error: Usuario ID es requerido");
      return res.status(400).json({ error: "Usuario ID es requerido" });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.log("❌ [Ordenes] Error: Items son requeridos o están vacíos");
      return res.status(400).json({ error: "Items son requeridos" });
    }

    console.log(
      "🔍 [Ordenes] Validando productos para IDs:",
      items.map((i) => i.productoId)
    );

    // Obtener los productos desde la base de datos
    const productosIds = items.map((item) => item.productoId);
    const productos = await Producto.findAll({
      where: {
        id: productosIds,
      },
    });

    console.log("📋 [Ordenes] Productos encontrados:", productos.length);

    if (productos.length === 0) {
      console.log("❌ [Ordenes] Error: No se encontraron productos válidos");
      return res
        .status(400)
        .json({ error: "No se encontraron productos válidos" });
    }

    // Calcular total y preparar items
    let totalCalculado = 0;
    const itemsOrden = [];

    for (const item of items) {
      const producto = productos.find((p) => p.id === item.productoId);

      if (!producto) {
        console.warn(`⚠️ [Ordenes] Producto no encontrado: ${item.productoId}`);
        continue;
      }

      const precioUnitario = parseFloat(producto.precio);
      const cantidad = parseInt(item.cantidad);

      if (isNaN(precioUnitario) || isNaN(cantidad) || cantidad <= 0) {
        console.warn(
          `⚠️ [Ordenes] Datos inválidos para producto ${item.productoId}`
        );
        continue;
      }

      const subtotal = precioUnitario * cantidad;
      totalCalculado += subtotal;

      itemsOrden.push({
        productoId: item.productoId,
        cantidad: cantidad,
        precioUnitario: precioUnitario,
      });
    }

    if (itemsOrden.length === 0) {
      console.log("[Ordenes] Error: No hay items válidos para procesar");
      return res
        .status(400)
        .json({ error: "No hay items válidos para procesar" });
    }

    // Construir dirección de envío
    const direccionEnvio = [
      direccion || "No especificado",
      ciudad || "No especificado",
      departamento || "No especificado",
      codigoPostal || "No especificado",
      telefono || "No especificado",
    ]
      .filter((part) => part && part !== "No especificado")
      .join(", ");

    console.log("💰 [Ordenes] Total calculado:", totalCalculado.toFixed(2));
    console.log("📍 [Ordenes] Dirección de envío:", direccionEnvio);

    // Crear la orden (UNA SOLA VEZ)
    console.log("⏳ [Ordenes] Intentando crear la orden en la DB...");
    const nuevaOrden = await Orden.create({
      usuarioId: usuarioId,
      direccionEnvio: direccionEnvio,
      metodoPago: metodoPago || "No especificado",
      metodoEnvio: "Envío gratis",
      estado: estado || "Pendiente",
      total: totalCalculado.toFixed(2),
    });
    console.log("[Ordenes] Orden creada con ID:", nuevaOrden.id);

    // Crear los items de la orden
    console.log("[Ordenes] Intentando crear los items de la orden en la DB...");
    const itemsConOrdenId = itemsOrden.map((item) => ({
      ...item,
      ordenId: nuevaOrden.id,
    }));

    const itemsCreados = await ItemOrden.bulkCreate(itemsConOrdenId);
    console.log("[Ordenes] Items creados:", itemsCreados.length);

    // Responder con la orden completa
    console.log("[Ordenes] Obteniendo orden completa para la respuesta...");
    const ordenCompleta = await Orden.findByPk(nuevaOrden.id, {
      include: [
        {
          model: ItemOrden,
          as: "items",
          include: [
            {
              model: Producto,
              as: "producto",
            },
          ],
        },
      ],
    });
    console.log("✅ [Ordenes] Orden completa obtenida. Enviando respuesta.");

    res.status(201).json({
      success: true,
      orden: ordenCompleta,
      mensaje: "Orden creada exitosamente",
    });
  } catch (error) {
    console.error("❌ [Ordenes] Error al crear la orden:", error);
    console.error(
      "[Ordenes] Detalles del error:",
      JSON.stringify(error, Object.getOwnPropertyNames(error))
    );
    res.status(500).json({
      error: "Error interno del servidor",
      details: error.message,
    });
  }
});

module.exports = router;
