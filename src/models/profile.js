const { Schema, model } = require('mongoose');

const profile = new Schema({
  age: { type: Number, required: true },
  city: { type: Number, required: true },
  big_5: { type: Number, required: true },
  gender: { type: Number, required: true },
  position: { type: Number, required: true },
  barriers: { type: Number, required: true },
  education: { type: Number, required: true },
  intentions: { type: Number, required: true },
  pst_profile: { type: Number, required: true },
  work_culture: { type: Number, required: true },
  pst_self_profile: { type: Number, required: true },
  initiative_to_join: { type: Number, required: true }
  // self_profile: { type: Number, required: true },
  // profile: { type: Number, required: true }
});

module.exports = model('profile', profile);
