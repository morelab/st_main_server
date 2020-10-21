const jwt = require('jsonwebtoken');
const axios = require('axios');

const User = require('../models/user');

signToken = user => {
  return jwt.sign(
    {
      iss: 'Morelab',
      sub: user.id,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 1)
    },
    process.env.JWT_SECRET
  );
};

module.exports = {
  signUp: async (req, res, next) => {
    const {
      user,
      pass,
      anonymous,
      name,
      priv,
      profile,
      devices,
      smartplug
    } = req.value.body;
    const checkUser = await User.findOne({ username: user });
    if (checkUser) return res.status(403).send({ err: 'El usuario existe' });

    const newUser = new User({
      username: user,
      password: pass,
      anonymous: anonymous,
      name: name,
      priv: priv,
      profile: profile,
      devices: devices,
      smartplug: smartplug
    });
    await newUser.save();

    const token = signToken(newUser);
    res.cookie('access_token', token, {
      httpOnly: true,
      sameSite: 'lax'
    });
    res.status(200).json({ success: true });
  },

  logIn: async (req, res, next) => {
    const token = signToken(req.user);
    res.cookie('access_token', token, {
      httpOnly: true,
      sameSite: 'lax'
    });
    res.status(200).json({ success: true });
  },

  dashboard: async (req, res, next) => {
    const username = req.user.username;
    const devices = req.user.devices;
    const smartplug = req.user.smartplug;
    const user = { username, devices, smartplug };
    let location = smartplug.location;
    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDay = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );
    let queryMonthly =
      process.env.INFLUX +
      'power?id=' +
      location +
      '&from=' +
      firstDay.getTime() / 1000 +
      '&to=' +
      lastDay.getTime() / 1000;
    let queryWeekly =
      process.env.INFLUX +
      'power?id=' +
      location +
      '&from=' +
      (date.getTime() / 1000 - 604800) +
      '&to=' +
      date.getTime() / 1000;
    let yesterday =
      new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() -
      86400000;
    let today = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    ).getTime();
    let queryYesterday =
      process.env.INFLUX +
      'power?id=' +
      location +
      '&from=' +
      yesterday / 1000 +
      '&to=' +
      (today - 1) / 1000;
    let queryToday =
      process.env.INFLUX +
      'power?id=' +
      location +
      '&from=' +
      today / 1000 +
      '&to=' +
      (today + 86399999) / 1000;
    console.log(queryMonthly);
    console.log(queryWeekly);
    console.log(queryYesterday);
    console.log(queryToday);
    // await axios.get(queryMonthly).then(res => {
    //   console.log(res.data)
    // }).catch(err => console.error(err))
    // await axios.get(queryWeekly).then(res => {
    //   console.log(res.data)
    // }).catch(err => console.error(err))
    // await axios.get(queryYesterday).then(res => {
    //   console.log(res.data)
    // }).catch(err => console.error(err))
    // await axios.get(queryToday).then(res => {
    //   console.log(res.data)
    // }).catch(err => console.error(err))
    res.json({
      secret: 'Data',
      user: user
    });
  },

  profile: async (req, res, next) => {
    var username;
    if (req.user.anonymous === false) {
      username = req.user.name;
    } else {
      username = req.user.smartplug.name;
    }
    const devices = req.user.devices;
    const anonymous = req.user.anonymous;
    const smartplug = req.user.smartplug;
    const user = { username, anonymous, devices, smartplug };
    res.json({
      user: user
    });
  },
  deleteProfile: async (req, res, next) => {
    await User.findOneAndDelete(req.user.username);
    await res.clearCookie('access_token');
    return res.json({ success: true });
  },
  changeStatus: async (req, res, nex) => {
    var anonymous = !req.user.anonymous;
    await User.findByIdAndUpdate(
      req.user.id,
      {
        anonymous
      },
      { new: true }
    );
    res.json({ success: true });
  },
  changePassword: async (req, res, next) => { },
  smartplug: async (req, res, next) => {
    res.json({ msg: 'hola' });
  },
  logOut: async (req, res, next) => {
    await res.clearCookie('access_token');
    res.json({ success: true });
  },

  checkAuth: async (req, res, next) => {
    res.json({
      success: true
    });
  },

  clearCookie: async (req, res, next) => {
    await res.clearCookie('access_token');
    res.json({ success: true });
  }
};
