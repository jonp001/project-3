const { Schema, model } = require("mongoose");

const eventSchema = new Schema({
    location: { type: Schema.Types.ObjectId, ref: "Location"},
    createdBy: {type: Schema.Types.ObjectId, ref: "User"},
    title: String,
    img: String,
    level: String,
    description: String,
    startTime: String,
    signedUp: {type: Boolean, default: false},
    // enum allows you to specify multiple values 
    eventType: {type: String, enum: ['race', 'group ride'], required: true}
    
  });

const Event = model("Event", eventSchema);

module.exports = Event;
