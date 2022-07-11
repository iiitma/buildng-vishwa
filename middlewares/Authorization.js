const User = require("../models/User");
const { TOKEN_SECRET } = require("../config");
const { Strategy, ExtractJwt } = require("passport-jwt");

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: TOKEN_SECRET
};

module.exports = passport => {
  passport.use(
    new Strategy(opts, async (payload, done) => {
      await User.findById(payload.user_id, '-hash_password -__v')
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => {
          return done(null, false);
        });
    })
  );
};