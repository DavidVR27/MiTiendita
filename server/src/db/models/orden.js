'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Orden extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Orden.belongsTo(models.Usuario, { foreignKey: 'usuarioId' });
      Orden.hasMany(models.ItemOrden, { foreignKey: 'ordenId' });
    }
  }
  Orden.init({
    usuarioId: DataTypes.INTEGER,
    direccionEnvio: DataTypes.TEXT,
    metodoPago: DataTypes.STRING,
    metodoEnvio: DataTypes.STRING,
    estado: DataTypes.STRING,
    total: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Orden',
  });
  return Orden;
};