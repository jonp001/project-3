const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const groupRideSchema = new Schema({
    location: String,
    createdBy: {type: Schema.Types.ObjectId, ref: "User"},
    title: String,
    img: String,
    level: String,
    description: String,
    signedUp: {type: Boolean, default: false},
  });

const GroupRide = model("GroupRide", userSchema);

module.exports = GroupRide;
