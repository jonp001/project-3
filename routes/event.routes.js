const express = require("express");
const router = express.Router();
const Event = require("../models/Event.model");

// CREATE EVENT
router.post("/createEvent", (req, res, next) => {
  Event.create(req.body)

    .then((event) => {
      res.json({ success: true, event });
    })
    .catch((err) => {
      res.json({ success: false, error: err });
    });
});

//READ
router.get("/", (req, res, next) => {
  Event.find({}, "title")

    .then((titles) => {
      res.json({ success: true, titles });
    })
    .catch((err) => {
      res.json({ success: false, error: err });
    });
});

// GET ALL GROUP RIDES
router.get("/groupRides", (req, res, next) => {
  Event.find({ eventType: "group ride" })

    .then((groupRides) => {
      res.json({ success: true, groupRides });
    })
    .catch((err) => {
      res.json({ success: false, error: err });
    });
});

//GET ALL RACES
router.get("/races", (req, res, next) => {
  Event.find({ eventType: "race" })

    .then((races) => {
      res.json({ success: true, races });
    })
    .catch((err) => {
      res.json({ success: false, error: err });
    });
});

//GET GROUP RIDE LISTING
router.get("/groupRides/:id", (req, res, next) => {
  Event.findById(req.params.id)

    .then((event) => {
      if (event.eventType !== "group ride") {
        res.status(404).json({ message: "NOT a group ride" });
      } else {
        res.json({ message: "Group ride found successfully", event: event });
      }
    })
    .catch((err) => {
      res.json({ success: false, error: err });
    });
});

// GET RACE LISTING
router.get("/races/:id", (req, res, next) => {
  Event.findById(req.params.id)

    .then((event) => {
      if (event.eventType !== "race") {
        res.status(404).json({ message: "NOT a race" });
      } else {
        res.json({ message: "Race found successfully", event: event });
      }
    })
    .catch((err) => {
      res.json({ success: false, error: err });
    });
});

//UPDATE RACE LISTING
router.put("/races/:id", (req, res, next) => {
  Event.findByIdAndUpdate(req.params.id, req.body, { new: true })

    .then((event) => {
      if (event.eventType !== "race") {
        res.status(404).json({ message: "NOT a race" });
      } else {
        res.json({ message: "Race found successfully", event: event });
      }
    })
    .catch((err) => {
      res.json({ success: false, error: err });
    });
});

//UPDATE Group Rides LISTING
router.put("/groupRides/:id", (req, res, next) => {
  Event.findByIdAndUpdate(req.params.id, req.body, { new: true }) // new: true updates with only new info
    .then((groupRides) => {
      res.json({ success: true, groupRides });
    })
    .catch((err) => {
      res.json({ success: false, error: err });
    });
});

// DELETE EVENT LISTING
router.delete("/event/:id", (req, res, next) => {
  Event.findByIdAndDelete(req.params.id)
    .then((deletedEvent) => {
      if (deletedEvent) {
        res.json({ success: true, message: "Event successfully deleted" });
      } else {
        res.status(404).json({ success: false, message: "Event not found" });
      }
    })
    .catch((err) => {
      res.json({ success: false, message: "An error occured", error: err });
    });
});

module.exports = router;
