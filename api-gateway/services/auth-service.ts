import * as userService from './user-service';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Config from '../config/constants';

export const login = async (email: string, password: string) => {
  const user = await userService.findUserByEmail(email);
  if (!user) {
    throw new Error('User does not exist');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Incorrect password');
  }
  const payload = {
    user: {
      id: user.id,
    },
  };
  const token = jwt.sign(payload, Config.jwtSecret, {
    expiresIn: '1h',
  });

  return { token };
};

export const register = async (email: string, password: string) => {
  const user = await userService.findUserByEmail(email);
  if (user) {
    throw new Error('User already exists');
  }
  const newUser = await userService.createUser(email, password);
  const payload = {
    user: {
      id: newUser.id,
    },
  };
  const token = jwt.sign(payload, Config.jwtSecret, {
    expiresIn: '1h',
  });

  return { token };
};
