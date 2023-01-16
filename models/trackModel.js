const { DataTypes } = require("sequelize");
const { createDB } = require("../config/db");

const Track = createDB.define("tracks", {
  id: { primaryKey: true, autoIncrement: true, type: DataTypes.INTEGER },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  artist: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Track;
