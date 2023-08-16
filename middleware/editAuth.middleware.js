const Event = require("../models/Event.model");

const isOwnerOrAdmin = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    if (event.createdBy._id.toString() !== req.payload._id && !req.payload.isAdmin) {
      return res.status(403).json({ success: false, message: "Not authorized to edit this event" });
    }

    next();
  } catch(err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  isOwnerOrAdmin
};