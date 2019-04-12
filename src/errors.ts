/*
  Error handler factory
  So that we don't repeat the same error message handling, lets use
  this factory in order to keep it clean.
  If necessary extend the factory in order to support more errors
*/
export const databaseError = error => {
  const errorHandler = {
    utilizador_email_key: () => 'User with the given email already exists'
  };
  return errorHandler[error]();
};
