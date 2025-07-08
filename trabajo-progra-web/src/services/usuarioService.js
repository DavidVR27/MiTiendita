const API_URL = 'http://localhost:3000/api/users';

/**
 * Registra un nuevo usuario.
 * @param {object} userData - Datos del usuario { nombre, apellido, email, password }.
 * @returns {Promise<object>} La respuesta de la API.
 */
const register = async (userData) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Error en el registro.');
  }
  return data;
};

/**
 * Inicia sesión de un usuario.
 * @param {object} credentials - Credenciales del usuario { email, password }.
 * @returns {Promise<object>} La respuesta de la API con el token y los datos del usuario.
 */
const login = async (credentials) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Error al iniciar sesión.');
  }
  return data;
};

export const usuarioService = {
  register,
  login,
};