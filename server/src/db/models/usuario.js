"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    // Relaciones entre tablas
    static associate(models) {
      Usuario.hasMany(models.Orden, { foreignKey: "usuarioId" });
      Usuario.hasMany(models.ItemCarrito, { foreignKey: "usuarioId" });
    }
  }
  Usuario.init(
    {
      nombre: DataTypes.STRING,
      apellido: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      rol: DataTypes.STRING,
      activo: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Usuario",
    }
  );
  return Usuario;
};
