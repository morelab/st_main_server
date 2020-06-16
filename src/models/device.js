const { Schema, model } = require('mongoose');

const DeviceSchema = new Schema({
	name: { type: String, required: true },
	in_use: { type: Boolean, required: true },
});

module.exports = model('device', DeviceSchema);
