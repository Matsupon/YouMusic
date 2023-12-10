const song = require("../models/song");

const router = require("express").Router();

router.get("/getAll", async (req, res) => {
  try {
      const data = await song.find({}, null, {
          sort: {
              createdAt: 1,
          },
      });

      if (data.length > 0) {
          return res.status(200).send({ success: true, songs: data });
      } else {
          return res.status(404).send({ success: false, msg: "No song found!" });
      }
  } catch (error) {
      return res.status(500).send({ success: false, msg: "Internal Server Error", error });
  }
});


router.get("/getOne/:getOne", async (req, res) => {
  const filter = { _id: req.params.getOne };

  const cursor = await song.findOne(filter);

  if (cursor) {
    res.status(200).send({ success: true, data: cursor });
  } else {
    res.status(200).send({ success: true, msg: "No Data Found" });
  }
});

router.post("/save", async (req, res) => {
  console.log("Request Body:", req.body);
  const newSong = song({
      name: req.body.name,
      imageURL: req.body.imageURL, 
      songURL: req.body.songURL,    
      artist: req.body.artist,
      album: req.body.album,
      language: req.body.language,
      category: req.body.category,
  });

  try {
     const savedSong = await newSong.save();
     return res.status(200).send({success: true, album: savedSong});
  } catch(error) {
     return res.status(400).send({success: false, msg: error});
  }
});

router.put("/update/:updateId", async (req, res) => {
  const filter = { _id: req.params.updateId };
  const options = {
    upsert: true,
    new: true,
  };
  try {
    const result = await song.findOneAndUpdate(
      filter,
      {
        name: req.body.name,
        imageURL: req.body.imageURL,
        songUrl: req.body.songUrl,
        album: req.body.album,
        artist: req.body.artist,
        language: req.body.language,
        category: req.body.category,
      },
      options
    );
    res.status(200).send({ artist: result });
  } catch (error) {
    res.status(400).send({ success: false, msg: error });
  }
});

router.delete("/delete/:deleteId", async (req, res) => {
  const filter = { _id: req.params.deleteId };

  const result = await song.deleteOne(filter);
  if (result.deletedCount === 1) {
    res.status(200).send({ success: true, msg: "Data Deleted" });
  } else {
    res.status(200).send({ success: false, msg: "Data Not Found" });
  }
});

router.get("/getFavouritesSongs", async (req, res) => {
  const query = req.query.songId;
  res.send(query);
});

module.exports = router;