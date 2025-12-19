import connectToDatabase from "../../lib/mongodb";
import Match from "../../models/Match";

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === "POST") {
    const { player1, player2 } = req.body;

    try {
      const match = await Match.create({ player1, player2 });
      res.status(201).json({ success: true, data: match });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
