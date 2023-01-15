const { Sequelize } = require("sequelize");

const createDB = new Sequelize("onedb", "user", "pass", {
  dialect: "sqlite",
  host: "./config/db.sqlite",
});

const connectDB = () => {
  createDB
    .sync()
    .then((res) => {
      console.log("Successfully connected to database");
    })
    .catch((err) => {
      console.log("Error connecting to database :  " + err.message);
    });
};

module.exports = { createDB, connectDB };
