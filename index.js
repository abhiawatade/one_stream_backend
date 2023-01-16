const express = require("express");
const app = express();
const PORT = 3000;
const { connectDB } = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const playlistRoutes = require("./routes/playlistRoutes");
const songRoutes = require("./routes/songRoutes");

//middleware

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/user", userRoutes);
app.use("/api/user/auth", playlistRoutes);
// app.use("api/user/auth/playlists/:id", playlistRoutes);
app.use("/api/user", songRoutes);

app.listen(PORT, () => {
  console.log("server listening on port");
  connectDB();
});
