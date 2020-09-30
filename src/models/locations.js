const { Schema, model } = require('mongoose');
const { string } = require('joi');

const locationScheme = new Schema({
  smartplug: { type: string },
  name: { type: string },
  location: { type: string }
});

const Location = model('location', locationScheme);

module.exports = Location;
