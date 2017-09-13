import { createError } from 'apollo-errors';
import {
  MONGO_ERROR,
  ACCESS_DENIED,
  UNAUTHORIZED_USER,
  INVALID_PERMISSION,
  WARNING_OF_OUTDATING,
} from './types';

export const TokenError = createError(INVALID_PERMISSION, {
  statusCode: 404,
  message: 'You don`t have permission to view this document',
});

export const UserError = createError(UNAUTHORIZED_USER, {
  statusCode: 401,
  message: 'User not authorized',
});

export const MongoError = createError(MONGO_ERROR, {
  message: 'Mongo Error',
});

export const AccessDenied = createError(ACCESS_DENIED, {
  message: 'You have not right edit this document',
});

export const WarningOfOutdating = createError(WARNING_OF_OUTDATING, {
  message: 'Document is outdated',
});
