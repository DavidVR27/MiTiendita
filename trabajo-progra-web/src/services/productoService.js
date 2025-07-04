export const productoService = {
  async obtenerProductos() {
    const response = await fetch("http://localhost:3000/api/productos");
    if (!response.ok) throw new Error("Error al obtener productos");
    return await response.json();
  },
};
