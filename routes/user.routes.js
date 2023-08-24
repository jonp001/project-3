const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/jwt.middleware.js');
const User = require('../models/User.model.js');



// Get a user's profile by user ID
router.get('/:userId', (req, res, next) => {
    const { userId } = req.params;
  
    User.findById(userId)
      .then(user => {
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        
        const {_id, name, bio, img, level, stravaProfile } = user;
        res.status(200).json(user);
      })
      .catch(err => next(err));
  });

//Update current user profile
router.put('/profile', isAuthenticated, (req, res, next) => {
    const userId= req.payload._id;

    //This is the data that can be updated
    const { bio, img, level, stravaProfile } = req.body;

    //This create new object with the properties that are able to be updated
    const updates = {
        ...(bio && { bio}),
        ...(img && { img}),
        ...(level && { level }),
        ...(stravaProfile && { stravaProfile })
    };

    User.findByIdAndUpdate(userId, updates, { new: true})
    .then(updatedUser => {
       //return updated user data
       const { bio, img, level, stravaProfile} = updatedUser;
       res.status(200).json({ bio, img, level, stravaProfile });
  })
  .catch(err => next(err));
});




module.exports = router;