import React from 'react';

export default () => <div />;

export const hintClass = ({ touched, error, warning }) => (
  touched &&
  (error && 'error-hint' || warning && 'warning-hint') ||
  'hidden-hint'
);
