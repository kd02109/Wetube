import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  text: { type: "String", required: true },
  createdAt: { type: Date, required: true, default: Date.now }, // required:date가 반드시 포함되어야 한다.
  video: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Video" },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
});

const Comment = mongoose.model("Comment", chatSchema);
export default Comment;
