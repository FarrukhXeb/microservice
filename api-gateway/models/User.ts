import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

export type UserDocument = mongoose.Document & {
  email: string;
  password: string;
};

const userSchema = new mongoose.Schema<UserDocument>(
  {
    email: { type: String, unique: true },
    password: String,
  },
  { timestamps: true }
);

userSchema.pre('save', function (next) {
  let user = this as UserDocument;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, (err: Error | undefined, salt: string) => {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, (err: Error | undefined, hash: string) => {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

export const User = mongoose.model<UserDocument>('User', userSchema);
