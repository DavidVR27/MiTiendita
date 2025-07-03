import React, { useEffect, useState } from 'react';
import { FaShoppingBag, FaTruck, FaCreditCard, FaMapMarkerAlt } from 'react-icons/fa';

const HistorialPedidos = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const ordenesGuardadas = JSON.parse(localStorage.getItem('ordenes') || '[]');
      // Ordenar por fecha, más recientes primero
      const ordenesOrdenadas = ordenesGuardadas.sort((a, b) => 
        new Date(b.fecha) - new Date(a.fecha)
      );
      setOrdenes(ordenesOrdenadas);
    } catch (error) {
      console.error('Error al cargar las órdenes:', error);
      setOrdenes([]);
    } finally {
      setLoading(false);
    }
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
      <h1 className="text-2xl font-bold mb-6 text-center">Historial de Pedidos</h1>
      <div className="space-y-6">
        {ordenes.map((orden) => (
          <div key={orden.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">
                  Orden #{orden.id}
                </div>
                <div className="font-semibold">
                  {new Date(orden.fecha).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-[#FE624C] text-xl">
                  S/ {Number(orden.resumenCompra?.total || 0).toFixed(2)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-start gap-2">
                <FaMapMarkerAlt className="text-[#FE624C] mt-1" />
                <div>
                  <div className="font-semibold">Dirección de Envío</div>
                  <div className="text-sm text-gray-600">
                    {orden.datosEnvio?.nombre} {orden.datosEnvio?.apellido}<br />
                    {orden.datosEnvio?.direccion}<br />
                    {orden.datosEnvio?.ciudad}, {orden.datosEnvio?.departamento}<br />
                    {orden.datosEnvio?.codigoPostal}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FaCreditCard className="text-[#FE624C] mt-1" />
                <div>
                  <div className="font-semibold">Método de Pago</div>
                  <div className="text-sm text-gray-600">{orden.metodoPago || 'No especificado'}</div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="font-semibold mb-2">Productos</div>
              <div className="space-y-2">
                {orden.resumenCompra?.productos?.map((producto, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{producto.nombre} x{producto.cantidad}</span>
                    <span>S/ {Number(producto.precio).toFixed(2)}</span>
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