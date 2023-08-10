const { Schema, model } = require("mongoose");

const locationSchema = new Schema({
    createdBy: {type: Schema.Types.ObjectId, ref: "User"},
    clubName: String,
    organization: String,
    state: String,
    city: String,
    startLocation: {
      lat: Number,
      lng: Number,
      address: String 
    },
    time: String,
    route: String,
    description: String,
  }, { timestamps: true });
 

const Location = model("Location", locationSchema);

module.exports = Location;
