const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define("recipe", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    img: {
      type: DataTypes.STRING,
    },
    dish_resume: {
      type: DataTypes.STRING(3000),
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
    },
    healthy_level: {
      type: DataTypes.INTEGER,
    },
    recipe: {
      type: DataTypes.JSON,
    },
  });

  sequelize.define("dishtypes", {
    name: {
      type: DataTypes.STRING,
    },
  });

  sequelize.define("diet", {
    name: {
      type: DataTypes.STRING,
    },
  });
};
