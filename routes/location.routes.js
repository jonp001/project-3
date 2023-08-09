const express = require("express");
const router = express.Router();
const Location = require("../models/Location.model");
const Event = require("../models/Event.model");

// CREATE LOCATION
router.post("/location", async (req, res, next) => {
  const { startLocation, eventId } = req.body;
  const  { latitude, longitude } = startLocation;

  if(!latitude || !longitude){
    return res.status(400).json({ message: "Both Latitude and Longitude are required!"});
  }

  const location = new Location({
   startLocation,
    address: startLocation.address,
    city: req.body.city,
    state: req.body.state
  });

  try{ 
    await location.save();
    //Link the location to the event using ID
    const event= await Event.findById(eventId);
    if (event) {
      event.location= location._id;
      await event.save();
    } else {
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
  Location.find({}, "state city startLocation.latitude startLocation.longitude")

    .then((locations) => {
      res.json({ success: true, locations });
    })
    .catch((err) => {
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
router.put("/location/:id", (req, res, next) => {
  Location.findByIdAndUpdate(req.params.id, req.body, { new: true })

    .then((location) => {
      if (!location) {
        res.status(404).json({ message: "No Location Found" });
      } else {
        res.json({ message: "Location Update Successful", location: location});
      }
    })
    .catch((err) => {
      res.json({ success: false, error: err });
    });
});


// DELETE LOCATION
router.delete("/location/:id", (req, res, next) => {
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
