const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado.' });
  }
  try {
    const decoded = jwt.verify(token, 'mi_clave_secreta_para_curso_2024');
    req.user = decoded; // { id, email, rol }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido o expirado.' });
  }
}

module.exports = authMiddleware; 