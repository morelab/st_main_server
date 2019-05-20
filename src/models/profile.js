'use strict';

var mongoose = require('mongoose');

var ProfileSchema = new mongoose.Schema({
  age: {
    type: Number,
    index: true,
    min: 0,
    max: 120,
    required: true,
  },
});

var Profile = mongoose.model('Profile', ProfileSchema);

module.exports = {
  Profile: Profile,
};
