import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Boton from '../../../Components/Boton';
import { FaUser, FaShoppingCart, FaCheck, FaTruck, FaCreditCard } from 'react-icons/fa';

const Direccion = () => {
    const navigate = useNavigate();
    // Se guarda la informacion del formulario en un estado
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        ciudad: '',
        departamento: '',
        direccion: '',
        codigoPostal: '',
        telefono: ''
    });
    const [total, setTotal] = useState(0);
    const [totalDescuento, setTotalDescuento] = useState(0);
    const [totalProductos, setTotalProductos] = useState(0);

    useEffect(() => {
        // Obtener datos del carrito
        const carrito = JSON.parse(localStorage.getItem('carrito') || '[]'); // Se lee del localStorage y se convierte de texto a objeto
        const totalCarrito = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0); // Se calcula el total del carrito
        const descuentoCarrito = carrito.reduce((acc, item) => { 
            if (item.descuento) {
                return acc + (item.precio * item.descuento * item.cantidad); // Se calcula el descuento del carrito
            }
            return acc;
        }, 0);
        
        setTotal(totalCarrito);
        setTotalDescuento(descuentoCarrito);
        setTotalProductos(carrito.length);
    }, []);

    const handleInputChange = (e) => {
        // Obtener el nombre y valor del campo que se está escribiendo
        const nombreCampo = e.target.name;
        const valorCampo = e.target.value;

        // Si es código postal o teléfono, solo permitir números
        if (nombreCampo === 'codigoPostal' || nombreCampo === 'telefono') {
            // Verificar si el valor contiene solo números
            let esSoloNumeros = true;
            for (let i = 0; i < valorCampo.length; i++) {
                if (isNaN(valorCampo[i])) {
                    esSoloNumeros = false;
                    break;
                }
            }
            // Si no son solo números, no actualizar el campo
            if (!esSoloNumeros) {
                return;
            }
        }

        // Quitar espacios al inicio y final
        const valorSinEspacios = valorCampo.trim();

        // Actualizar el estado del formulario
        setFormData({
            ...formData,
            [nombreCampo]: valorSinEspacios
        });
    };

    const validarFormulario = () => {
        // Lista de campos que deben estar llenos
        const camposObligatorios = ['nombre', 'apellido', 'ciudad', 'departamento', 'direccion', 'codigoPostal', 'telefono'];
        
        // Revisar cada campo obligatorio
        for (let campo of camposObligatorios) {
            // Si el campo está vacío o solo tiene espacios
            if (!formData[campo] || formData[campo].trim() === '') {
                alert('Por favor complete todos los campos requeridos');
                return false;
            }
        }

        // Validar código postal (debe tener 6 números)
        if (formData.codigoPostal.length !== 6) {
            alert('El código postal debe tener 6 números');
            return false;
        }

        // Validar teléfono (debe tener 9 números)
        if (formData.telefono.length !== 9) {
            alert('El teléfono debe tener 9 números');
            return false;
        }

        // Si todo está bien, retornar true
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validarFormulario()) {
            // Guardar datos de dirección en localStorage
            localStorage.setItem('datosEnvio', JSON.stringify(formData));
            // Navegar a la página de método de pago
            navigate('/tienda/checkout/pago');
        }
    };

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Process Stepper */}
            <div className="mb-8">
                <div className="flex items-center justify-center">
                    <div className="flex items-center">
                        <div className="flex items-center relative">
                            <div className="rounded-full h-10 w-10 py-3 px-3 bg-[#FE624C] text-white font-bold border-2 border-[#FE624C]">
                                <FaShoppingCart className="h-full w-full" />
                            </div>
                            <div className="absolute top-0 left-0 mt-12 w-32 text-center text-sm font-medium text-[#FE624C]">
                                Carrito
                            </div>
                        </div>
                        <div className="flex-auto border-t-2 border-[#FE624C] w-32"></div>
                    </div>
                    <div className="flex items-center">
                        <div className="flex items-center relative">
                            <div className="rounded-full h-10 w-10 py-3 px-3 bg-[#FE624C] text-white font-bold border-2 border-[#FE624C]">
                                <FaTruck className="h-full w-full" />
                            </div>
                            <div className="absolute top-0 left-0 mt-12 w-32 text-center text-sm font-medium text-[#FE624C]">
                                Envío
                            </div>
                        </div>
                        <div className="flex-auto border-t-2 border-gray-300 w-32"></div>
                    </div>
                    <div className="flex items-center">
                        <div className="flex items-center relative">
                            <div className="rounded-full h-10 w-10 py-3 px-3 bg-gray-300 text-white font-bold border-2 border-gray-300">
                                <FaCreditCard className="h-full w-full" />
                            </div>
                            <div className="absolute top-0 left-0 mt-12 w-32 text-center text-sm font-medium text-gray-500">
                                Pago
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <h1 className="text-2xl font-bold mb-4">Información de Envío</h1>
            
            <div className="flex flex-row items-start gap-6">
                {/* Formulario de dirección */}
                <div className="w-3/5">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center gap-2 mb-4">
                            <FaUser className="text-[#FE624C] text-lg" />
                            <h2 className="text-lg font-semibold">Datos de Envío</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FE624C] focus:ring-[#FE624C]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                                    <input
                                        type="text"
                                        name="apellido"
                                        value={formData.apellido}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FE624C] focus:ring-[#FE624C]"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
                                    <input
                                        type="text"
                                        name="ciudad"
                                        value={formData.ciudad}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FE624C] focus:ring-[#FE624C]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Departamento</label>
                                    <input
                                        type="text"
                                        name="departamento"
                                        value={formData.departamento}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FE624C] focus:ring-[#FE624C]"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                                <input
                                    type="text"
                                    name="direccion"
                                    value={formData.direccion}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FE624C] focus:ring-[#FE624C]"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Código Postal</label>
                                    <input
                                        type="text"
                                        name="codigoPostal"
                                        value={formData.codigoPostal}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FE624C] focus:ring-[#FE624C]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                                    <input
                                        type="tel"
                                        name="telefono"
                                        value={formData.telefono}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FE624C] focus:ring-[#FE624C]"
                                        required
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Resumen de la compra */}
                <div className="w-2/5">
                    <div className="bg-white p-3 rounded-lg shadow-md">
                        <div className="flex items-center gap-2 mb-2">
                            <FaShoppingCart className="text-[#FE624C] text-lg" />
                            <h2 className="text-lg font-semibold">Resumen de la Compra</h2>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-gray-600 text-sm">
                                <span>Subtotal ({totalProductos} productos)</span>
                                <span>S/ {total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 text-sm">
                                <span>Descuento</span>
                                <span className="text-red-500">-S/ {totalDescuento.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 text-sm">
                                <span>Envío</span>
                                <span className="text-green-500">GRATIS</span>
                            </div>
                            <hr className="my-2 border-gray-200" />
                            <div className="flex justify-between font-semibold text-base">
                                <span>TOTAL</span>
                                <span>S/ {(total - totalDescuento).toFixed(2)}</span>
                            </div>
                            <div className="mt-3">
                                <Boton
                                    texto="Seleccionar Método de Pago"
                                    onClick={handleSubmit}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Direccion;
