const { Schema, model } = require('mongoose');

const DeviceSchema = new Schema({
  name: { type: String, required: true }
});

module.exports = model('device', DeviceSchema);
