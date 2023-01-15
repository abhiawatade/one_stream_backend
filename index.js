const express = require("express");
const app = express();
const PORT = 3000;
const { connectDB } = require("./config/db");

//middleware

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(PORT, () => {
  console.log("server listening on port");
  connectDB();
});
