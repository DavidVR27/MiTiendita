const express = require("express");
const router = express.Router();
const { Usuario } = require("../models");

router.post("/registro", async (req, res) => {
  try {
    const { nombre, apellido, email, password, rol = "cliente" } = req.body;

    if (!nombre || !apellido || !email || !password) {
      return res.status(400).json({ 
        error: "Todos los campos son requeridos" 
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: "Formato de email inválido" 
      });
    }

    if (password.length < 8) {
      return res.status(400).json({ 
        error: "La contraseña debe tener al menos 8 caracteres" 
      });
    }

    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ 
        error: "El email ya está registrado" 
      });
    }

    const nuevoUsuario = await Usuario.create({
      nombre,
      apellido,
      email,
      password: password,
      rol,
      activo: true
    });

    const { password: _, ...usuarioSinPassword } = nuevoUsuario.toJSON();

    console.log("✅ [Usuarios] Usuario registrado exitosamente:", email);
    res.status(201).json({
      message: "Usuario registrado exitosamente",
      usuario: usuarioSinPassword
    });

  } catch (error) {
    console.error("❌ [Usuarios] Error en registro:", error);
    res.status(500).json({ 
      error: "Error interno del servidor" 
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: "Email y contraseña son requeridos" 
      });
    }

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ 
        error: "Credenciales inválidas" 
      });
    }

    if (!usuario.activo) {
      return res.status(401).json({ 
        error: "Cuenta desactivada" 
      });
    }

    if (usuario.password !== password) {
      return res.status(401).json({ 
        error: "Credenciales inválidas" 
      });
    }

    const { password: _, ...usuarioSinPassword } = usuario.toJSON();

    console.log("✅ [Usuarios] Login exitoso:", email);
    res.json({
      message: "Login exitoso",
      usuario: usuarioSinPassword
    });

  } catch (error) {
    console.error("❌ [Usuarios] Error en login:", error);
    res.status(500).json({ 
      error: "Error interno del servidor" 
    });
  }
});

router.put("/:id/cambiar-password", async (req, res) => {
  try {
    const { id } = req.params;
    const { passwordActual, passwordNueva } = req.body;

    if (!passwordActual || !passwordNueva) {
      return res.status(400).json({ 
        error: "Contraseña actual y nueva contraseña son requeridas" 
      });
    }

    if (passwordNueva.length < 8) {
      return res.status(400).json({ 
        error: "La nueva contraseña debe tener al menos 8 caracteres" 
      });
    }

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ 
        error: "Usuario no encontrado" 
      });
    }

    if (usuario.password !== passwordActual) {
      return res.status(401).json({ 
        error: "Contraseña actual incorrecta" 
      });
    }

    await usuario.update({
      password: passwordNueva
    });

    console.log("✅ [Usuarios] Contraseña actualizada:", id);
    res.json({
      message: "Contraseña actualizada exitosamente"
    });

  } catch (error) {
    console.error("❌ [Usuarios] Error al cambiar contraseña:", error);
    res.status(500).json({ 
      error: "Error interno del servidor" 
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    if (!usuario) {
      return res.status(404).json({ 
        error: "Usuario no encontrado" 
      });
    }

    res.json(usuario);

  } catch (error) {
    console.error("❌ [Usuarios] Error al obtener usuario:", error);
    res.status(500).json({ 
      error: "Error interno del servidor" 
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, rol, activo } = req.body;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ 
        error: "Usuario no encontrado" 
      });
    }

    const datosActualizar = {};
    if (nombre) datosActualizar.nombre = nombre;
    if (apellido) datosActualizar.apellido = apellido;
    if (email) datosActualizar.email = email;
    if (rol) datosActualizar.rol = rol;
    if (activo !== undefined) datosActualizar.activo = activo;

    await usuario.update(datosActualizar);

    const { password: _, ...usuarioActualizado } = usuario.toJSON();

    console.log("✅ [Usuarios] Usuario actualizado:", id);
    res.json({
      message: "Usuario actualizado exitosamente",
      usuario: usuarioActualizado
    });

  } catch (error) {
    console.error("❌ [Usuarios] Error al actualizar usuario:", error);
    res.status(500).json({ 
      error: "Error interno del servidor" 
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    res.json(usuarios);

  } catch (error) {
    console.error("❌ [Usuarios] Error al obtener usuarios:", error);
    res.status(500).json({ 
      error: "Error interno del servidor" 
    });
  }
});

module.exports = router; 