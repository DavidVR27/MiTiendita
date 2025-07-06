import React, { useEffect, useState } from "react";
import {
  FaShoppingBag,
  FaTruck,
  FaCreditCard,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { ordenService } from "../../../services/ordenService";

const HistorialPedidos = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        const usuario = JSON.parse(localStorage.getItem("usuario"));
        if (usuario && usuario.id) {
          const data = await ordenService.obtenerOrdenesPorUsuario(usuario.id);
          setOrdenes(data);
        }
      } catch (error) {
        console.error("Error al cargar las órdenes:", error);
        setOrdenes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdenes();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-600">Cargando historial...</p>
      </div>
    );
  }

  if (!ordenes || ordenes.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Historial de Pedidos</h1>
        <p className="text-gray-600">No tienes pedidos registrados.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Historial de Pedidos
      </h1>
      <div className="space-y-6">
        {ordenes.map((orden) => (
          <div key={orden.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">
                  Orden #{orden.id}
                </div>
                <div className="font-semibold">
                  {new Date(orden.createdAt).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-[#FE624C] text-xl">
                  S/ {Number(orden.total || 0).toFixed(2)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-start gap-2">
                <FaMapMarkerAlt className="text-[#FE624C] mt-1" />
                <div>
                  <div className="font-semibold">Dirección de Envío</div>
                  <div className="text-sm text-gray-600">
                    {orden.direccionEnvio}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FaCreditCard className="text-[#FE624C] mt-1" />
                <div>
                  <div className="font-semibold">Método de Pago</div>
                  <div className="text-sm text-gray-600">
                    {orden.metodoPago || "No especificado"}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="font-semibold mb-2">Productos</div>
              <div className="space-y-2">
                {orden.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center text-sm"
                  >
                    <div className="flex items-center">
                      <img
                        src={item.producto.imagenUrl}
                        alt={item.producto.nombre}
                        className="w-12 h-12 object-cover mr-4 rounded"
                      />
                      <div>
                        <span>
                          {item.producto.nombre} x{item.cantidad}
                        </span>
                      </div>
                    </div>
                    <span>S/ {Number(item.precioUnitario).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistorialPedidos; 