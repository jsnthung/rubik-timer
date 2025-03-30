import { Solve } from "../models/solve.model.js";

export const addSolve = async (req, res) => {
  try {
    const { time, penalty, scramble, event, timestamp, note } = req.body;

    const solve = await Solve.create({
      userId: req.userId,
      time,
      penalty,
      scramble,
      event,
      timestamp,
      note,
    });

    res.status(201).json({ success: true, solve });
  } catch (error) {
    console.error("Error adding solve:", error);
    res.status(500).json({ success: false, message: "Failed to add solve" });
  }
};

export const getSolvesByUser = async (req, res) => {
  try {
    const solves = await Solve.find({ userId: req.userId }).sort({
      timestamp: -1,
    });
    res.status(200).json({ success: true, solves });
  } catch (error) {
    console.error("Error fetching solves:", error);
    res.status(500).json({ success: false, message: "Failed to fetch solves" });
  }
};

export const updateSolve = async (req, res) => {
  const { id } = req.params;
  const { penalty, note } = req.body;

  try {
    const updatedSolve = await Solve.findOneAndUpdate(
      { _id: id, userId: req.userId },
      {
        $set: {
          ...(penalty !== undefined && { penalty }),
          ...(note !== undefined && { note }),
        },
      },
      { new: true }
    );

    if (!updatedSolve) {
      return res.status(404).json({ message: "Solve not found" });
    }

    res.status(200).json({ success: true, solve: updatedSolve });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteSolve = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedSolve = await Solve.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!deletedSolve) {
      return res.status(404).json({ message: "Solve not found" });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
