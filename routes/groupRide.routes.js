const express= require('express');
const router= express.Router();
const GroupRide= require("../models/GroupRide.model");

router.get("/", (req, res, next ) => {
    GroupRide.find({}, "title")
    
    .then((titles) => {
        res.json(titles)
})
.catch((err) => {
    res.json(err)
  }) 
}); 

module.exports = router;