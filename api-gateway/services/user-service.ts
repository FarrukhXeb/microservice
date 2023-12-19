import { User, UserDocument } from '../models/User';

export const createUser = (email: string, password: string) => {
  const user = new User({ email, password });

  return user.save();
};

export const findUserById = (id: string) => {
  return User.findById(id);
};

export const findUserByEmail = (email: string) => {
  return User.findOne({ email });
};
