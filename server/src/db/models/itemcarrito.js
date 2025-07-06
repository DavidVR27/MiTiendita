"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ItemCarrito extends Model {
    
    static associate(models) {
      ItemCarrito.belongsTo(models.Usuario, { foreignKey: "usuarioId" });
      ItemCarrito.belongsTo(models.Producto, { foreignKey: "productoId" });
    }
  }
  ItemCarrito.init(
    {
      usuarioId: DataTypes.INTEGER,
      productoId: DataTypes.INTEGER,
      cantidad: DataTypes.BIGINT,
      guardado: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "ItemCarrito",
    }
  );
  return ItemCarrito;
};
