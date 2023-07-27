const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const eventSchema = new Schema({
    location: String,
    createdBy: {type: Schema.Types.ObjectId, ref: "User"},
    title: String,
    img: String,
    level: String,
    description: String,
    signedUp: {type: Boolean, default: false},
    // enum allows you to specify multiple values 
    eventType: {type: String, enum: ['race', 'group ride'], required: true}
    
  });

const Event = model("Event", eventSchema);

module.exports = Event;
