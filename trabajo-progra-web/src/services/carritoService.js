const API_URL = "http://localhost:3000/api/carrito";

export const carritoService = {
  // 🔄 Obtener productos del carrito desde la base de datos
  obtenerCarritoDesdeAPI: async (usuarioId) => {
    try {
      const res = await fetch(`${API_URL}/${usuarioId}`);
      if (!res.ok) throw new Error("Error al obtener carrito");
      return await res.json();
    } catch (err) {
      console.error("Error en obtenerCarritoDesdeAPI:", err);
      return [];
    }
  },

  // 📦 Obtener productos guardados para después
  obtenerGuardadosDesdeAPI: async (usuarioId) => {
    try {
      const res = await fetch(`${API_URL}/${usuarioId}/guardados`);
      if (!res.ok) throw new Error("Error al obtener guardados");
      return await res.json();
    } catch (err) {
      console.error("Error en obtenerGuardadosDesdeAPI:", err);
      return [];
    }
  },

  // 🔁 Actualizar la cantidad de un producto en el carrito
  actualizarCantidad: async (itemCarritoId, nuevaCantidad) => {
    try {
      const res = await fetch(`${API_URL}/${itemCarritoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cantidad: nuevaCantidad }),
      });
      if (!res.ok) throw new Error("Error al actualizar cantidad");
      return await res.json();
    } catch (err) {
      console.error("Error en actualizarCantidad:", err);
      return null;
    }
  },

  // 📥 Marcar producto como guardado para después
  guardarProducto: async (itemCarritoId) => {
    try {
      const res = await fetch(`${API_URL}/${itemCarritoId}/guardar`, {
        method: "PUT",
      });
      if (!res.ok) throw new Error("Error al guardar producto");
      return await res.json();
    } catch (err) {
      console.error("Error en guardarProducto:", err);
      return null;
    }
  },

  // ❌ Eliminar producto del carrito
  eliminarProductoDelCarrito: async (itemCarritoId) => {
    try {
      const res = await fetch(`${API_URL}/${itemCarritoId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar producto");
      return await res.json();
    } catch (err) {
      console.error("Error en eliminarProductoDelCarrito:", err);
      return null;
    }
  },

  // 🔄 Devolver producto guardado al carrito
  devolverAlCarrito: async (itemCarritoId) => {
    try {
      const res = await fetch(`${API_URL}/${itemCarritoId}/devolver`, {
        method: "PUT",
      });
      if (!res.ok) throw new Error("Error al devolver producto al carrito");
      return await res.json();
    } catch (err) {
      console.error("Error en devolverAlCarrito:", err);
      return null;
    }
  },

  // 🗑️ Eliminar producto guardado permanentemente
  eliminarGuardado: async (itemCarritoId) => {
    try {
      const res = await fetch(`${API_URL}/guardados/${itemCarritoId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar guardado");
      return await res.json();
    } catch (err) {
      console.error("Error en eliminarGuardado:", err);
      return null;
    }
  },
};
