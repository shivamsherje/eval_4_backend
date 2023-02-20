const express = require("express");
const { PostModel } = require("../Models/Posts.model");
const postRoutes = express.Router();

postRoutes.get("/", async (req, res) => {
  const { status } = req.query;
  const userID = req.body.userID;

  if (status) {
    const result = await PostModel.find({
      userID: userID,
    });
    res.send(result);
  } else {
    console.log("error occured");
    res.send({ msg: "something went wrong" });
  }
});

postRoutes.post("/create", async (req, res) => {
  const payload = req.body;
  try {
    const new_post = new PostModel(payload);
    await new_post.save();
    res.send({ msg: "post created successfully" });
  } catch (error) {
    console.log("error:", error);
    res.send({ msd: "Something went wrong" });
  }
});

postRoutes.patch("/update/:id", async (req, res) => {
  const id = req.params.id;
  const payload = req.body;

  const note = await PostModel.findOne({
    _id: id,
  });
  const userId_in_note = note.userID;
  const userID_making_req = req.body.userID;

  try {
    if (userID_making_req !== userId_in_note) {
      res.send({ msg: "You are authorised" });
    } else {
      await PostModel.findByIdAndUpdate(
        {
          _id: id,
        },
        payload
      );
      res.send("update the post");
    }
  } catch (error) {
    console.log("error:", error);
    res.send({ msd: "Something went wrong" });
  }
});

postRoutes.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;

  const note = await PostModel.findOne({
    _id: id,
  });
  const userId_in_note = note.userID;
  const userID_making_req = req.body.userID;

  try {
    if (userID_making_req !== userId_in_note) {
      res.send({ msg: "You are not authorised" });
    } else {
      await PostModel.findByIdAndDelete({
        _id: id,
      });
      res.send("Deleted the post");
    }
  } catch (error) {
    console.log("error:", error);
    res.send({ msd: "Something went wrong" });
  }
});

module.exports = {
  postRoutes,
};
