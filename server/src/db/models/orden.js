"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Orden extends Model {
    
    static associate(models) {
      Orden.belongsTo(models.Usuario, { foreignKey: "usuarioId" });
      Orden.hasMany(models.ItemOrden, { foreignKey: "ordenId", as: "items" });
    }
  }
  Orden.init(
    {
      usuarioId: DataTypes.BIGINT,
      direccionEnvio: DataTypes.TEXT,
      metodoPago: DataTypes.STRING,
      metodoEnvio: DataTypes.STRING,
      estado: DataTypes.STRING,
      total: DataTypes.DECIMAL,
    },
    {
      sequelize,
      modelName: "Orden",
      tableName: "Ordens", 
    }
  );
  return Orden;
};
