import mongoose from 'mongoose';
import passport from 'passport';
import passportJWT from 'passport-jwt';
import Config from '../config/constants';
import { User, UserDocument } from '../models/User';

const ExtractJWT = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;

const params = {
  secretOrKey: Config.jwtSecret,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
};

export default function () {
  const strategy = new Strategy(params, (payload, done) => {
    User.findOne({ _id: payload.id }, (err: mongoose.Error, user: UserDocument) => {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, { id: user._id });
      }
      return done(null, false);
    });
  });

  passport.use(strategy);

  return {
    initialize: () => passport.initialize(),
    authenticate: () => passport.authenticate('jwt', { session: false }),
  };
}
