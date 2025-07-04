export const productoService = {
  async obtenerProductos() {
    const response = await fetch("http://localhost:3000/api/productos");
    if (!response.ok) throw new Error("Error al obtener productos");
    return await response.json();
  },

  async obtenerProductoPorId(id) {
    const response = await fetch(`http://localhost:3000/api/productos/${id}`);
    if (!response.ok) throw new Error("Error al obtener el producto");
    return await response.json();
  },
};
