const express = require("express");
const { where } = require("sequelize");
const router = express.Router();
const Track = require("../models/trackModel");
router.get("/songs", async (req, res) => {
  const apiKey = "366c10f67e48c63530fc7da891e2a54e";
  const endpoint = "http://ws.audioscrobbler.com/2.0/";

  const params = new URLSearchParams({
    method: "chart.gettoptracks",
    api_key: apiKey,
    format: "json",
  });

  try {
    const response = await fetch(`${endpoint}?${params}`);
    const data = await response.json();
    const tracks = data.tracks.track;
    // tracks.forEach((track) => console.log(track.name));
    // res.status(200).send("sucess");
    tracks.forEach(async (track) => {
      await Track.create({
        name: track.name,
        artist: track.artist.name,
        image: track.image[2]["#text"],
        url: track.url,
      });
    });
    res.json(tracks);
  } catch (error) {
    console.log(error);
  }
});

// router.get("/songs/:id", async (req, res) => {
//   try {
//     const song = await Track.findOne(req.params.id);
//     return res.status(200).send(song);
//   } catch (error) {
//     console.log(error);
//   }
// });

router.get("/songs/:id", async (req, res) => {
  try {
    const track = await Track.findByPk(req.params.id);
    if (!track) {
      return res.status(404).json({ error: "Track not found" });
    }
    res.json(track);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/songs/search", async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm;
    const tracks = await Track.findAll({
      where: {
        [Sequelize.Op.or]: [
          { name: { [Sequelize.Op.like]: `%${searchTerm}%` } },
          { artist: { [Sequelize.Op.like]: `%${searchTerm}%` } },
        ],
      },
    });
    res.json(tracks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// router.get("/api/songs/search", async (req, res) => {
//   try {
//     const searchTerm = req.query.searchTerm;
//     const tracks = await Track.findAll({
//       where: Sequelize.where(
//         Sequelize.fn("LOWER", Sequelize.col("name")),
//         Sequelize.fn("LOWER", searchTerm)
//       ),
//     });
//     if (!tracks.length) {
//       return res.status(404).json({ error: "Track not found" });
//     }
//     res.json(tracks);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

module.exports = router;
