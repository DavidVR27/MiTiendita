const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');
const router = express.Router();

// POST /auth/register
router.post('/register', async (req, res) => {
  try {
    const { nombre, apellido, email, password, rol } = req.body;
    if (!nombre || !apellido || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }
    const existe = await Usuario.findOne({ where: { email } });
    if (existe) {
      return res.status(409).json({ message: 'El email ya está registrado.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const usuario = await Usuario.create({
      nombre,
      apellido,
      email,
      password: hashedPassword,
      rol: rol || 'user',
      activo: true
    });
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.status(201).json({
      nombre: nombre,
      apellido: apellido,
      email: email,
      rol: rol,
      activo: true,
      message: 'Usuario registrado exitosamente.',
      token
    });
    console.log('nombre:', nombre ,'apellido:', apellido,'email:', email,'rol:', rol,'token:', token);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el registro.' });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son obligatorios.' });
    }
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({
      message: 'Login exitoso.',
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el login.' });
  }
});

// POST /auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'El email es obligatorio.' });
    }
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(404).json({ message: 'No existe un usuario con ese email.' });
    }
    const resetToken = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({
      message: 'Token de recuperación generado. (En producción se enviaría por email)',
      resetToken
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al generar el token de recuperación.' });
  }
});

module.exports = router; 