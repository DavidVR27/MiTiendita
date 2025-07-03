import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import Boton from '../../../Components/Boton';
import { carritoService } from '../../../services/carritoService';

const ConfirmacionOrden = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");

    useEffect(() => {
        // Obtener datos necesarios del localStorage
        const carrito = carritoService.obtenerCarrito();
        const datosEnvio = JSON.parse(localStorage.getItem('datosEnvio') || '{}');
        const metodoPago = localStorage.getItem('metodoPago') || 'No especificado';
        const metodoEnvio = localStorage.getItem('metodoEnvio') || 'No especificado';
        const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

        if (!usuario.correo) {
            setError('Debes iniciar sesión para realizar un pedido.');
            return;
        }

        // Calcular totales
        const total = carrito.reduce((acc, item) => {
            const precioConDescuento = item.descuento 
                ? item.precio * (1 - item.descuento) 
                : item.precio;
            return acc + (precioConDescuento * item.cantidad);
        }, 0);

        // Crear objeto de orden
        const nuevaOrden = {
            id: Date.now(), // Usar timestamp como ID único
            fecha: new Date().toISOString(),
            productos: carrito,
            datosEnvio,
            metodoPago,
            metodoEnvio,
            resumenCompra: {
                total,
                productos: carrito.map(item => ({
                    nombre: item.nombre,
                    cantidad: item.cantidad,
                    precio: item.descuento 
                        ? (item.precio * (1 - item.descuento)).toFixed(2)
                        : item.precio.toFixed(2)
                }))
            },
            correo: usuario.correo || "",
            nombre: usuario.nombre || ""
        };

        // Obtener órdenes existentes y añadir la nueva
        const ordenesExistentes = JSON.parse(localStorage.getItem('ordenes') || '[]');
        ordenesExistentes.push(nuevaOrden);
        localStorage.setItem('ordenes', JSON.stringify(ordenesExistentes));

        // Limpiar el carrito después de guardar la orden
        carritoService.vaciarCarrito();
        localStorage.removeItem('datosEnvio');
        localStorage.removeItem('metodoPago');
        localStorage.removeItem('metodoEnvio');
    }, []);

    if (error) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-2xl font-bold mb-4 text-red-600">{error}</h1>
                    <button
                        onClick={() => navigate('/login')}
                        className="text-[#FE624C] hover:text-[#e5533d] font-medium mt-4"
                    >
                        Ir a iniciar sesión
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
                <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-6" />
                <h1 className="text-3xl font-bold mb-4">¡Pedido Confirmado!</h1>
                <p className="text-gray-600 mb-8">
                    Gracias por tu compra. Tu pedido ha sido procesado exitosamente.
                    Te enviaremos un correo electrónico con los detalles de tu compra.
                </p>
                <div className="space-y-4">
                    <Boton
                        texto="Ver Historial de Pedidos"
                        onClick={() => navigate('/historial-pedidos')}
                    />
                    <button
                        onClick={() => navigate('/')}
                        className="text-[#FE624C] hover:text-[#e5533d] font-medium"
                    >
                        Volver al inicio
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmacionOrden; 