const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Usuario } = require("../models");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// POST /users/register
router.post("/register", async (req, res) => {
  try {
    // Verificar que req.body existe
    if (!req.body) {
      return res.status(400).json({
        message:
          "Datos JSON requeridos. Asegúrate de enviar Content-Type: application/json",
      });
    }

    const { nombre, apellido, email, password, rol } = req.body;
    if (!nombre || !apellido || !email || !password) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios." });
    }
    const existe = await Usuario.findOne({ where: { email } });
    if (existe) {
      return res.status(409).json({ message: "El email ya está registrado." });
    }

    const usuario = await Usuario.create({
      nombre,
      apellido,
      email,
      password,
      rol: rol || "cliente",
      activo: true,
    });

    res.status(201).json({
      id: usuario.id,
      nombre: nombre,
      apellido: apellido,
      email: email,
      rol: rol,
      activo: true,
      message: "Usuario registrado exitosamente.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el registro." });
  }
});

// POST /users/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email y contraseña son obligatorios." });
    }
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }
    if (password !== usuario.password) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    // Enviar el token y los datos del usuario en la respuesta
    res.json({
      message: "Login exitoso.",

      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el login." });
  }
});

// POST /users/forgot-password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "El email es obligatorio." });
    }
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res
        .status(404)
        .json({ message: "No existe un usuario con ese email." });
    }
    const resetToken = jwt.sign(
      { id: usuario.id, email: usuario.email },
      "mi_clave_secreta_para_curso_2024",
      { expiresIn: "1h" }
    );
    res.json({
      message: "Token de recuperación generado.",
      resetToken,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al generar el token de recuperación." });
  }
});

// PUT /users/:id/change-password usar el token de reset
router.put("/:id/change-password", authMiddleware, async (req, res) => {
  try {
    // Verificar que req.body existe
    if (!req.body) {
      return res.status(400).json({
        message:
          "Datos JSON requeridos. Asegúrate de enviar Content-Type: application/json",
      });
    }

    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    // Validar que se proporcionen ambas contraseñas
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message:
          "La contraseña anterior y la nueva contraseña son obligatorias.",
      });
    }

    // Buscar el usuario
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // Verificar que la contraseña anterior sea correcta
    if (oldPassword !== usuario.password) {
      return res
        .status(401)
        .json({ message: "La contraseña anterior es incorrecta." });
    }

    // Actualizar la contraseña (sin hashear)
    usuario.password = newPassword;
    await usuario.save();

    res.json({ message: "Contraseña actualizada exitosamente." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al cambiar la contraseña." });
  }
});

// PUT /users/change-password (usa token de recuperación)
router.put("/change-password", async (req, res) => {
  try {
    // Verificar que req.body existe
    if (!req.body) {
      return res.status(400).json({
        message:
          "Datos JSON requeridos. Asegúrate de enviar Content-Type: application/json",
      });
    }

    const { token, nuevaContrasenia } = req.body;

    // Validar que se proporcionen token y nueva contraseña
    if (!token || !nuevaContrasenia) {
      return res
        .status(400)
        .json({ message: "Token y nueva contraseña son obligatorios." });
    }

    // Verificar el token de recuperación
    let payload;
    try {
      payload = jwt.verify(token, "mi_clave_secreta_para_curso_2024");
    } catch (err) {
      return res.status(401).json({ message: "Token inválido o expirado." });
    }

    // Buscar el usuario usando el ID del token
    const usuario = await Usuario.findByPk(payload.id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // Actualizar la contraseña (sin hashear)
    usuario.password = nuevaContrasenia;
    await usuario.save();

    res.json({ message: "Contraseña actualizada exitosamente." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al cambiar la contraseña." });
  }
});

// PUT /users/:id (actualiza datos excepto contraseña)
router.put("/:id/update", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, rol, activo } = req.body;

    // Buscar el usuario
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // Actualizar solo los campos permitidos
    if (nombre !== undefined) usuario.nombre = nombre;
    if (apellido !== undefined) usuario.apellido = apellido;
    if (email !== undefined) usuario.email = email;
    if (rol !== undefined) usuario.rol = rol;
    if (activo !== undefined) usuario.activo = activo;

    await usuario.save();

    res.json({ message: "Usuario actualizado exitosamente." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el usuario." });
  }
});

// GET /users/:id/delete
router.get("/:id/delete", async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar el usuario
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // Eliminar el usuario
    await usuario.destroy();

    res.json({ message: "Usuario eliminado exitosamente." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar el usuario." });
  }
});

module.exports = router;
