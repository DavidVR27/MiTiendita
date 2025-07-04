"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ItemCarrito extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ItemCarrito.belongsTo(models.Usuario, { foreignKey: "usuarioId" });
      ItemCarrito.belongsTo(models.Producto, { foreignKey: "productoId" });
    }
  }
  ItemCarrito.init(
    {
      usuarioId: DataTypes.INTEGER,
      productoId: DataTypes.INTEGER,
      cantidad: DataTypes.INTEGER,
      guardado: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "ItemCarrito",
    }
  );
  return ItemCarrito;
};
