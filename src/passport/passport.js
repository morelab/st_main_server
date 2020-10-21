const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

// JSON Web Token Strategy
const cookierExtractor = req => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['access_token'];
  }
  return token;
};

passport.use(
  'jwt',
  new JwtStrategy(
    {
      jwtFromRequest: cookierExtractor,
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true
    },
    async (req, payload, done) => {
      await User.findById(payload.sub)
        .then(user => {
          if (!user) return done(null, false);
          req.user = user;
          done(null, user);
        })
        .catch(err => done(err, false));
    }
  )
);

//Local Strategy
passport.use(
  'local',
  new LocalStrategy(
    {
      usernameField: 'user',
      passwordField: 'pass'
    },
    async (user, pass, done) => {
      try {
        const logUser = await User.findOne({ username: user });
        if (!logUser) return done(null, false);

        const passOk = await logUser.isValidPassword(pass);
        if (!passOk) return done(null, false);

        done(null, logUser);
      } catch (err) {
        done(err, false);
      }
    }
  )
);
