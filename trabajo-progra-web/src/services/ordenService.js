const API_URL = "http://localhost:3000/api/ordenes";

export const ordenService = {
  crearOrden: async (orden) => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orden),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al crear la orden");
      }
      return await res.json();
    } catch (err) {
      console.error("Error en crearOrden:", err);
      throw err;
    }
  },

  obtenerOrdenesPorUsuario: async (usuarioId) => {
    try {
      const res = await fetch(`${API_URL}/usuario/${usuarioId}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.error || "Error al obtener las órdenes del usuario"
        );
      }
      return await res.json();
    } catch (err) {
      console.error("Error en obtenerOrdenesPorUsuario:", err);
      throw err;
    }
  },
};
