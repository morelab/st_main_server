const jwt = require('jsonwebtoken');
const axios = require('axios');
const Etcd = require('node-etcd');
const etcd = new Etcd('127.0.0.1:2379');

const User = require('../models/user');
parser = data => {
  let jump = Math.round(Object.keys(data).length / 1000);
  let retArray = new Array();
  for (let i = 1; i < data.length; i += jump) {
    let array = new Array();
    array.push(parseInt(data[i].t.toString().substring(0, 13)));
    array.push(data[i].v);
    retArray.push(array);
  }
  return retArray;
};
parserYesterday = data => {
  let jump = Math.round(Object.keys(data).length / 5000);
  let retArray = new Array();
  for (let i = 1; i < data.length; i += jump) {
    let array = new Array();
    array.push(parseInt(data[i].t.toString().substring(0, 13) + 86400));
    array.push(data[i].v);
    retArray.push(array);
  }
  return retArray;
};

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
    if (checkUser)
      return res
        .status(403)
        .send({
          err:
            'El usuario con este nombre de usuario ya existe o no se ha asignado un dispositivo'
        });

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
    var monthData;
    var weekData;
    var yesterdayData;
    var todayData;
    console.log(queryMonthly);
    await axios
      .get(queryMonthly)
      .then(res => {
        monthData = parser(res.data);
        console.log(monthData);
      })
      .catch(err => console.error(err));
    await axios
      .get(queryWeekly)
      .then(res => {
        weekData = parser(res.data);
      })
      .catch(err => console.error(err));
    await axios
      .get(queryYesterday)
      .then(res => {
        yesterdayData = parserYesterday(res.data);
      })
      .catch(err => console.error(err));
    await axios
      .get(queryToday)
      .then(res => {
        todayData = parser(res.data);
      })
      .catch(err => console.error(err));
    res.json({
      monthData,
      weekData,
      yesterdayData,
      todayData,
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
    console.log(req.user);
    await User.findByIdAndRemove(req.user._id);
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
  changePassword: async (req, res, next) => {},
  smartplug: async (req, res, next) => {
    const checkLocation = await User.findOne({
      'smartplug.location': req.body.location
    });
    if (checkLocation) {
      return res
        .status(403)
        .send({ err: 'Existe una cuenta con esta ubicación' });
    }
    etcd.get('smartplugs/id_to_userid/' + req.body.location, (err, etcdRes) => {
      if (err === null) {
        res.status(200).json({ alias: etcdRes.node.value });
      } else {
        res.status(406).json({ err: 'No location found' });
      }
    });
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
