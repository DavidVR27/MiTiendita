'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductoCategoria extends Model {
    static associate(models) {
      // No se necesita ya que es una tabla intermedia
    }
  }
  ProductoCategoria.init({
    productoId: DataTypes.INTEGER,
    categoriaId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ProductoCategoria',
  });
  return ProductoCategoria;
};