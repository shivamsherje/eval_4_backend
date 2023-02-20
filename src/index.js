const express = require("express");
const { connection } = require("../config/db");
const { userRoutes } = require("../Routes/User.Route");
const { postRoutes } = require("../Routes/Post.Route");
const { authenticate } = require("../middlewears/Authenticate");
require("dotenv").config();
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("homepage");
});

app.use("/users", userRoutes);
app.use(authenticate);
app.use("/posts", postRoutes);

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("DB connection successful");
  } catch (err) {
    console.log("Connection Failed");
  }
  console.log(`Server running at ${process.env.port}`);
});
