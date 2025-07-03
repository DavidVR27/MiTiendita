"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Producto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Producto.hasMany(models.ItemCarrito, { foreignKey: "productoId" });
      Producto.hasMany(models.ItemOrden, { foreignKey: "productoId" });
      Producto.belongsTo(models.Serie, { foreignKey: "serieId" });
      Producto.belongsToMany(models.Categoria, {
        through: "ProductoCategoria",
        foreignKey: "productoId",
        otherKey: "categoriaId",
      });
    }
  }
  Producto.init(
    {
      nombre: DataTypes.STRING,
      descripcion: DataTypes.TEXT,
      precio: DataTypes.DECIMAL,
      stock: DataTypes.INTEGER,
      activo: DataTypes.BOOLEAN,
      imagen: DataTypes.STRING,
      marca: DataTypes.STRING,
      //serieID: DataTypes.INTEGER,
      serieId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Producto",
    }
  );
  return Producto;
};
