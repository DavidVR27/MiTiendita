"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ItemOrden extends Model {
    
    static associate(models) {
      ItemOrden.belongsTo(models.Orden, { foreignKey: "ordenId" });
      ItemOrden.belongsTo(models.Producto, {
        foreignKey: "productoId",
        as: "producto",
      });
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
      tableName: "ItemOrdens", 
    }
  );
  return ItemOrden;
};
