const express = require("express");
const router = express.Router();
const Event = require("../models/Event.model");
const Location= require("../models/Location.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const { isOwnerOrAdmin } = require("../middleware/editAuth.middleware");

// CREATE EVENT
router.post("/createEvent", isAuthenticated, (req, res, next) => {
  console.log(req.payload)
 

  const eventData = {
    ...req.body,
    createdBy: req.payload._id
  };
  console.log("Constructed Event Data:", eventData)
  Event.create(eventData)

    .then((event) => {
      res.json({ success: true, event });
    })
    .catch((err) => {
      res.json({ success: false, error: err });
    });
});

// EVENT SIGNUP 
router.post("/:id/signup", isAuthenticated, (req, res) => {
  Event.findById(req.params.id)
      .then(event => {
        if (!event) {
          return res.status(404).json({ message: "Event not found" });
      }
      // this initilizes the event signup array to 0
      if (!event.signedUpUsers) {
        event.signedUpUsers = [];
    }
          // Check if user already signed up
          if (event.signedUpUsers.includes(req.payload._id)) {
              return res.status(400).json({ message: "Already signed up" });
          }
          // Add user to the signed up users list
          event.signedUpUsers.push(req.payload._id);
          return event.save();
      })
      .then(event => Event.findById(event._id).populate('signedUpUsers')) 
      .then(event => res.json({ success: true, event }))
      .catch(err => res.status(500).json({ success: false, error: err.message }));
});

// EVENT UNSIGNUP
router.post("/:id/unsignup", isAuthenticated, (req, res) => {
  Event.findById(req.params.id)
      .then(event => {
          const index = event.signedUpUsers.indexOf(req.payload._id);
          if (index === -1) {
              return res.status(400).json({ message: "User not signed up for this event" });
          }
          // Remove user from the signed up users list
          event.signedUpUsers.splice(index, 1);
          return event.save();
      })
      .then(event => Event.findById(event._id).populate('signedUpUsers'))
      .then(event => res.json({ success: true, event }))
      .catch(err => res.status(500).json({ success: false, error: err.message }));
});

// GET INDIVIDUAL EVENT LISTING BY ID
router.get("/:id",  async (req, res, next) => {
  try {
    const event=await Event.findById(req.params.id)
    .populate('location')
    .populate('createdBy')
    .populate('signedUpUsers');

    if(!event) {
      return res.status(404).json ({ message: "Event not found" });
    }

     res.json({ success: true, event });
  } catch(err) {
      res.status(500).json({ success: false, error: err.message });
  }
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

// UPDATE EVENT LISTING
router.put("/edit-event/:id", isAuthenticated, isOwnerOrAdmin, (req, res, next) => {
  console.log(req.body)
  Event.findByIdAndUpdate(req.params.id, req.body, { new: true })

    .then((event) => {
      res.json({ success: true, event });
    })
    .catch((err) => {
      console.log(err)
      res.json({ success: false, error: err });
    });
});

// DELETE EVENT LISTING
router.delete("/event/:id", isAuthenticated, isOwnerOrAdmin, (req, res, next) => {
  let deletedLocation = null;

  Event.findById(req.params.id)
    .then((event) => {
      if (!event) {
        res.status(404).json({ success: false, message: "Event not found" });
        return Promise.reject(new Error("Event not found")); // Stop the promise chain
      }

      if (event.location) {
        return Location.findByIdAndDelete(event.location);
      }
    })
    .then((location) => {
      deletedLocation = location; // Save the location information if needed
      return Event.findByIdAndDelete(req.params.id);
    })
    .then((deletedEvent) => {
      if (deletedEvent) {
        let message = "Event successfully deleted";
        if (deletedLocation) {
          message += " along with its associated location";
        }
        res.json({ success: true, message: message });
      }
    })
    .catch((err) => {
      res.json({ success: false, message: "An error occurred", error: err.message });
    });
});

module.exports = router;
