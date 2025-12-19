import mongoose from "mongoose";

const MatchSchema = new mongoose.Schema({
  player1: {
    username: String,
    score: Number,
  },
  player2: {
    username: String,
    score: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Match || mongoose.model("Match", MatchSchema);
