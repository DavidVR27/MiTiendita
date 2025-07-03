'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Serie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Serie.hasMany(models.Producto, { foreignKey: 'serieId' });
    }
  }
  Serie.init({
    nombre: DataTypes.STRING,
    descripcion: DataTypes.STRING,
    imagen: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Serie',
  });
  return Serie;
};