"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ItemOrden extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ItemOrden.belongsTo(models.Orden, { foreignKey: "ordenId" });
      ItemOrden.belongsTo(models.Producto, { foreignKey: "productoId" });
    }
  }
  ItemOrden.init(
    {
      ordenId: DataTypes.INTEGER,
      productoId: DataTypes.INTEGER,
      cantidad: DataTypes.INTEGER,
      precioUnitario: DataTypes.DECIMAL,
    },
    {
      sequelize,
      modelName: "ItemOrden",
      tableName: "ItemOrdens", // ✅ Nombre exacto de tu tabla
    }
  );
  return ItemOrden;
};
