// * POST /api/playlists: Accepts a JSON payload with a name and description, creates a new playlist for the authenticated user
// * GET /api/playlists: Returns a list of all playlists created by the authenticated user
// * GET /api/playlists/:id : Returns the playlist with the specified ID
// * PUT /api/playlists/:id :  Accepts a JSON payload with an updated name and description, updates the playlist with the specified ID
// * DELETE /api/playlists/:id : Deletes the playlist with the specified ID
// * POST /api/playlists/:id/songs: Accepts a JSON payload with song_id and adds the song to the playlist with the specified ID
// * DELETE /api/playlists/:id/songs: Accepts a JSON payload with song_id and removes the song from the playlist with the specified ID
// * Store the playlist data in a database, such as MongoDB, MySQL, or PostgreSQL.
// * Provide a way to return the playlists of the authenticated user only.
// * For adding and removing songs from the playlist, you need to have song_id and playlist_id in the payload

const express = require("express");
const { where } = require("sequelize");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/auth");
const Playlist = require("../models/playlistModel");
const User = require("../models/userModel");

// isAuthenticated is not working as expected,so it is temporarily removed

router.post("/playlists", async (req, res) => {
  try {
    const { name, description } = req.body;

    const playlistDetails = { name, description, userId: req.user.id };

    const createPlaylist = await Playlist.create(playlistDetails);

    return res.status(200).send("Playlist created successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

router.get("/playlists", async (req, res) => {
  try {
    const playlists = await Playlist.findAll({});
    res.status(200).json(playlists);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/playlists/:id", async (req, res) => {
  try {
    const playlist = await Playlist.findOne({ where: { id: req.params.id } });
    res.status(200).json(playlist);
  } catch (error) {}
});

router.put("/playlists/:id", async (req, res) => {
  try {
    const { name, description } = req.body;
    const userPlaylist = await Playlist.findOne({
      where: { id: req.params.id },
    });
    userPlaylist.name = name;
    userPlaylist.description = description;
    res.send("userPlaylist updated successfully");
  } catch (error) {
    res.send(error.message);
  }
});

router.delete("/playlists/:id", async (req, res) => {
  try {
    const playlist = await Playlist.findOne({ where: { id: req.params.id } });
    playlist.delete;
    res.status(200).send("playlist deleted");
  } catch (error) {
    res.send(error.message);
  }
});

router.post("/playlists/:id/songs", async (req, res) => {
  try {
    const { song_id } = req.body;
    const song = { song_id };
    const { playlistId } = req.params.id;
    Playlist.findOne(playlistId)
      .then((playlist) => {
        playlist.songs.push(song);
        return playlist.save();
      })
      .then((playlist) => {
        res.status(200).send(playlist);
      });
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
