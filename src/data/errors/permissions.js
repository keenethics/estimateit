import { createError } from 'apollo-errors';
import { INVALID_PERMISSION } from './types';

const TokenError = createError(INVALID_PERMISSION, {
  message: 'You don`t have permission to view this document ----------',
});

export default TokenError;
