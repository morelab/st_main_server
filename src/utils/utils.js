'use strict';

const datesHour = (req, res, next) => {
  let now = new Date();

  let hourBefore = new Date(new Date().setHours(now.getHours() - 1));

  req.start = hourBefore.toISOString();
  req.end = now.toISOString();

  next();
};

const datesToday = (req, res, next) => {
  let lastMidnight = new Date();
  lastMidnight.setHours(0, 0, 0, 0);

  let nextMidnight = new Date();
  nextMidnight.setHours(24, 0, 0, 0); // next midnight

  req.start = lastMidnight.toISOString();
  req.end = nextMidnight.toISOString();

  next();
};

const datesDay = (req, res, next) => {
  let now = new Date();

  let yesterday = new Date(new Date().setDate(now.getDate() - 1));

  req.start = yesterday.toISOString();
  req.end = now.toISOString();

  next();
};

const datesWeek = (req, res, next) => {
  let now = new Date();

  let lastWeek = new Date(new Date().setDate(now.getDate() - 7));

  req.start = lastWeek.toISOString();
  req.end = now.toISOString();

  next();

};

const datesMonth = (req, res, next) => {
  let now = new Date();

  let lastMonth = new Date(new Date().setMonth(now.getMonth() - 1));

  req.start = lastMonth.toISOString();
  req.end = now.toISOString();

  next();
};


const datesForever = (req, res, next) => {
  let now = new Date();

  let firstPossibleDate = new Date(new Date().setFullYear(2018));

  req.start = firstPossibleDate.toISOString();
  req.end = now.toISOString();

  next();
};

// const toLocaleUTC = (date) => {
//   return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
// };

function findWithAttr(array, attr, value) {
  for (var i = 0; i < array.length; i += 1) {
    if (array[i][attr] === value) {
      return i;
    }
  }
  return -1;
}

module.exports = {
  datesHour,
  datesToday,
  datesDay,
  datesWeek,
  datesMonth,
  datesForever,
  findWithAttr,
};
