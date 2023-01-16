const { DataTypes } = require("sequelize");
const { createDB } = require("../config/db");

const Playlist = createDB.define("playlists", {
  id: { primaryKey: true, autoIncrement: true, type: DataTypes.INTEGER },
  //   user_id: { primaryKey: true, type: DataTypes.INTEGER },
  name: DataTypes.STRING,
  description: DataTypes.STRING,
  songs: DataTypes.CHAR,
});

module.exports = Playlist;
