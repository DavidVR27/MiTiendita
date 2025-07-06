'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Categoria extends Model {
    
    static associate(models) {
      Categoria.belongsToMany(models.Producto, {
        through: 'ProductoCategoria',
        foreignKey: 'categoriaId',
        otherKey: 'productoId'
      });
    }
  }
  Categoria.init({
    nombre: DataTypes.STRING,
    descripcion: DataTypes.STRING,
    imagen: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Categoria',
  });
  return Categoria;
};