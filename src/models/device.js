'use strict';

var mongoose = require('mongoose');

var DeviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

var Device = mongoose.model('Device', DeviceSchema);

module.exports = {
  Device: Device,
};
