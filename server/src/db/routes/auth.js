const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');
const rolesMiddleware = require('../middleware/rolesMiddleware');
const router = express.Router();

// PUT /users/change-password
router.put('/change-password', async (req, res) => {
  try {
    const { token, nuevaContrasenia } = req.body;
    if (!token || !nuevaContrasenia) {
      return res.status(400).json({ message: 'Token y nueva contraseña son obligatorios.' });
    }
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Token inválido o expirado.' });
    }
    const usuario = await Usuario.findByPk(payload.id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
    const hashedPassword = await bcrypt.hash(nuevaContrasenia, 10);
    usuario.password = hashedPassword;
    await usuario.save();
    res.json({ message: 'Contraseña actualizada exitosamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al cambiar la contraseña.' });
  }
});

// PUT /users/:id
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email } = req.body;
    if (parseInt(id) !== req.user.id && req.user.rol !== 'admin') {
      return res.status(403).json({ message: 'No tienes permiso para editar este perfil.' });
    }
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
    if (nombre) usuario.nombre = nombre;
    if (apellido) usuario.apellido = apellido;
    if (email) usuario.email = email;
    await usuario.save();
    res.json({ message: 'Perfil actualizado exitosamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el perfil.' });
  }
});

module.exports = router;
