"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Serie extends Model {
    
    static associate(models) {
      Serie.hasMany(models.Producto, { foreignKey: "serieId" });
    }
  }
  Serie.init(
    {
      nombre: DataTypes.STRING,
      descripcion: DataTypes.STRING,
      imagen: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Serie",
    }
  );
  return Serie;
};
