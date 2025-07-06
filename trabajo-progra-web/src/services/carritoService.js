const API_URL = "http://localhost:3000/api/carrito";

export const carritoService = {
  // ➕ Agregar un producto al carrito
  agregarProducto: async (producto, cantidad, usuarioId) => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuarioId: usuarioId,
          productoId: producto.id,
          cantidad: cantidad,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.error || "Error al agregar producto al carrito"
        );
      }
      return await res.json();
    } catch (err) {
      console.error("Error en agregarProducto:", err);
      throw err;
    }
  },

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
  actualizarCantidadEnAPI: async (itemCarritoId, nuevaCantidad) => {
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
      console.error("Error en actualizarCantidadEnAPI:", err);
      return null;
    }
  },

  // 📥 Marcar producto como guardado para después
  marcarComoGuardadoEnAPI: async (itemCarritoId) => {
    try {
      const res = await fetch(`${API_URL}/${itemCarritoId}/guardar`, {
        method: "PUT",
      });
      if (!res.ok) throw new Error("Error al guardar producto");
      return await res.json();
    } catch (err) {
      console.error("Error en marcarComoGuardadoEnAPI:", err);
      return null;
    }
  },

  // ❌ Eliminar producto del carrito
  eliminarDeAPI: async (itemCarritoId) => {
    try {
      const res = await fetch(`${API_URL}/${itemCarritoId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar producto");
      // DELETE no suele devolver contenido, así que no esperamos un json.
      return { success: true }; 
    } catch (err) {
      console.error("Error en eliminarDeAPI:", err);
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

  // --- Funciones para Local Storage ---
  // Eliminado por requerimiento de proyecto:
  // Ya no se permite el uso de localStorage para guardar datos de carrito.
  // La fuente oficial de datos debe ser PostgreSQL vía API backend.
  // Correccion hecha por david e
  /*
  // 📦 Obtener el carrito desde localStorage
  obtenerCarrito: () => {
    const carrito = localStorage.getItem('carrito');
    return carrito ? JSON.parse(carrito) : [];
  },
  */

  // 🗑️ Vaciar el carrito en la base de datos y localStorage
  vaciarCarrito: async (usuarioId) => {
    try {
      const res = await fetch(`${API_URL}/vaciar/${usuarioId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al vaciar el carrito");
      }
      // También limpiar de localStorage por si acaso
      localStorage.removeItem("carrito");
      return { success: true };
    } catch (err) {
      console.error("Error en vaciarCarrito:", err);
      throw err;
    }
  },
};