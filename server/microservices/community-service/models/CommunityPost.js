import mongoose from "mongoose";

//Define the schema for a CommunityPost document in MongoDB.
const communityPostSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ["news", "discussion"],
  },
  aiSummary: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

export default mongoose.model("CommunityPost", communityPostSchema);
