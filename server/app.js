const express = require("express");
const app = express();
require("dotenv/config");
const cors = require("cors");
const { default: mongoose } = require("mongoose");

app.use(cors({ origin: true }));
app.use(express.json());

// user authentication routes
const userRoute = require("./routes/auth");
app.use("/api/users/", userRoute);

// Artist links
const artistsRoute = require("./routes/artists");
app.use("/api/artists/", artistsRoute);

// Album links
const albumRoute = require("./routes/albums");
app.use("/api/albums/", albumRoute);

// Songs links
const songRoute = require("./routes/songs");
app.use("/api/songs/", songRoute);

mongoose.connect(process.env.DB_STRING);

mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
}).on("error", (error) => {
    console.log(`MongoDB Connection Error: ${error}`);
});


app.listen(4000, () => console.log("listening to port 4000"));
