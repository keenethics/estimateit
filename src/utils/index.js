import jwt from 'jsonwebtoken';
import config from '../config';

export const verifyToken = (token) => {
  if (token) {
    return jwt.verify(token, config.SECRET);
  }
  return null;
};

export const createToken = (user) => {
  return jwt.sign(user, config.SECRET, {
    expiresIn: 10080000,
  });
};
