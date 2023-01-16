const { DataTypes } = require("sequelize");
const { createDB } = require("../config/db");

const User = createDB.define("users", {
  id: { primaryKey: true, autoIncrement: true, type: DataTypes.INTEGER },
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  resetToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = User;
