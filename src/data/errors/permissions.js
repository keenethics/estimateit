import { createError } from 'apollo-errors';
import { INVALID_PERMISSION } from './types';

const TokenError = createError(INVALID_PERMISSION, {
  statusCode: 404,
  message: 'You don`t have permission to view this document ----------',
});

export default TokenError;
