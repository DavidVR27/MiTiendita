'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Categoria extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Categoria.belongsToMany(models.Producto, {
        through: 'ProductoCategoria',
        foreignKey: 'categoriaId',
        otherKey: 'productoId'
      });
    }
  }
  Categoria.associate = models => {
    Categoria.belongsToMany(models.Producto, { through: 'CategoriaProducto' });
  };
  
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
