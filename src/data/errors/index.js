import { createError } from 'apollo-errors';
import { INVALID_PERMISSION, UNAUTHORIZED_USER } from './types';

export const TokenError = createError(INVALID_PERMISSION, {
  statusCode: 404,
  message: 'You don`t have permission to view this document',
});
export const UserError = createError(UNAUTHORIZED_USER, {
  statusCode: 401,
  message: 'User not authorized',
});

