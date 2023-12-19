import passport from 'passport';
import passportJWT from 'passport-jwt';
import Config from '../config/constants';
import { User } from '../models/User';

const ExtractJWT = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;

const params = {
  secretOrKey: Config.jwtSecret,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
};

export default function () {
  const strategy = new Strategy(params, async (payload, done) => {
    const user = await User.findById(payload.user.id);
    if (user) {
      return done(null, { id: user.id });
    }
    return done(new Error('User not found'), false);
  });

  passport.use(strategy);

  return {
    initialize: () => passport.initialize(),
    authenticate: () => passport.authenticate('jwt', { session: false }),
  };
}
