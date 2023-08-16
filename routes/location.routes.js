const express = require("express");
const router = express.Router();
const Location = require("../models/Location.model");
const Event = require("../models/Event.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const { isOwnerOrAdmin } = require("../middleware/editAuth.middleware");

// CREATE LOCATION
router.post("/location", async (req, res, next) => {
  const { startLocation, eventId } = req.body;
  const  { lat, lng } = startLocation;

  if(typeof lat !== "number" || typeof lng !== "number"){
    return res.status(400).json({ message: "Both Latitude and Longitude are required!"});
  }

  const location = new Location({
   startLocation,
    address: startLocation.address,
    city: req.body.city,
    state: req.body.state
  });
  console.log(req.body)

  try{ 
    await location.save();
    console.log("Saved Location:", location);

    //Link the location to the event using ID
    const event= await Event.findById(eventId);
    console.log("Found Event:", event);


    if (event) {
      event.location= location._id;
      await event.save();
    } else {
      await location.delete(); // deletes location if event doesnt exist
      return res.status(400).json({ message: "Event not found" });
    }

    res.status(201).json(location);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occured while saving location"})
  }
}); 


//READ ALL LOCATIONS
router.get("/allLocations", (req, res, next) => {
  Location.find({}, "state city startLocation.lat startLocation.lng")

    .then((locations) => {
      res.json({ success: true, locations });
    })
    .catch((err) => {
      res.json({ success: false, error: err });
    });
});

router.get("/location/:locationId", (req, res, next) => {
  Location.findById(req.params.locationId)
    .then((location) => {
      if (location) {
        res.json({ success: true, location });
      } else {
        res.status(404).json({ success: false, message: "Location not found" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({ success: false, error: err });
    });
});

// GET ALL EVENTS IN A LOCATION
router.get("/allLocations/:locationId/events", async (req, res, next) => {
    const { locationId } = req.params;
    try{
        const events = await Event.find({ location: locationId});
        res.json({success: true, events})
    } catch(err) {
      res.json({ success: false, error: err });
    };
});



//UPDATE LOCATION 
router.put("/edit-location/:id", isAuthenticated,  (req, res, next) => {
  Location.findByIdAndUpdate(req.params.id, req.body, { new: true })

    .then((location) => {
      res.json({ success: true, location });
    })
    .catch((err) => {
      console.log(err);
      res.json({ success: false, error: err });
    });
});


// DELETE LOCATION
router.delete("/location/:id", isAuthenticated, (req, res, next) => {
  Location.findByIdAndDelete(req.params.id)
    .then((deletedLocation) => {
      if (deletedLocation) {
        res.json({ success: true, message: "Location successfully deleted" });
      } else {
        res.status(404).json({ success: false, message: "Location not found" });
      }
    })
    .catch((err) => {
      res.json({ success: false, message: "An error occured", error: err });
    });
});

module.exports = router;
