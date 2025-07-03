import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sección de la tienda */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Mi-Tiendita</h3>
            <p className="text-gray-600 mb-4">
              Tu tienda de confianza para todos tus productos favoritos. Calidad y servicio garantizado.
            </p>
            <p className="text-gray-600">
              © {new Date().getFullYear()} Mi-Tiendita. Todos los derechos reservados.
            </p>
          </div>

          {/* Enlaces útiles */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Enlaces Útiles</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/categorias" className="text-gray-600 hover:text-[#FE624C]">
                  Categorías
                </Link>
              </li>
              <li>
                <Link to="/busqueda" className="text-gray-600 hover:text-[#FE624C]">
                  Búsqueda Avanzada
                </Link>
              </li>
              <li>
                <Link to="/historial-pedidos" className="text-gray-600 hover:text-[#FE624C]">
                  Historial de Pedidos
                </Link>
              </li>
              <li>
                <Link to="/perfil" className="text-gray-600 hover:text-[#FE624C]">
                  Mi Perfil
                </Link>
              </li>
            </ul>
          </div>

          {/* Atención al Cliente */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Atención al Cliente</h3>
            <ul className="space-y-2">
              <li className="text-gray-600">
                Horario de atención:
                <br />
                Lun - Vie: 9:00 - 18:00
                <br />
                Sáb: 9:00 - 13:00
              </li>
              <li className="text-gray-600">
                Teléfono: (01) 555-0123
              </li>
              <li className="text-gray-600">
                Email: atencion@mi-tiendita.com
              </li>
            </ul>
          </div>

          {/* Información Legal */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terminos" className="text-gray-600 hover:text-[#FE624C]">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link to="/privacidad" className="text-gray-600 hover:text-[#FE624C]">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link to="/devoluciones" className="text-gray-600 hover:text-[#FE624C]">
                  Política de Devoluciones
                </Link>
              </li>
              <li>
                <Link to="/envios" className="text-gray-600 hover:text-[#FE624C]">
                  Información de Envíos
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
            Grupo 03 - Programación Web
            </p>
            <div className="flex space-x-4">
              <span className="text-gray-500 text-sm">Métodos de pago aceptados:</span>
              <span className="text-gray-700 font-medium">Visa</span>
              <span className="text-gray-700 font-medium">Mastercard</span>
              <span className="text-gray-700 font-medium">American Express</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 