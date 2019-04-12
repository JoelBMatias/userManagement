import { body, check, validationResult } from 'express-validator/check';

export const validator = async (req, _res, next) => {
  const methodValidation = {
    POST: () => [
      body('email', 'Invalid email')
        .exists()
        .isEmail(),
      body('givenName', 'Missing givenName')
        .exists()
        .isAlpha(),
      body('familyName')
        .exists()
        .isAlpha()
    ],
    PUT: () => [
      body('email', 'Invalid email')
        .optional()
        .isEmail(),
      body('givenName', 'Missing givenName')
        .optional()
        .isAlpha(),
      body('familyName')
        .optional()
        .isAlpha()
    ]
  };
  console.log('RECEIVED REQUEST METHOD', req.method);
  return methodValidation[req.method]();

  // req.getValidationResult();
  //
  // const validationResults = await req.getValidationResult();
  // console.log('VALIDATION RESULTS ISEMPTY', validationResults.isEmpty());
  // // console.log('VALIDATION RESULTS ERRORS', validationResults.array());
  // return next();
};
