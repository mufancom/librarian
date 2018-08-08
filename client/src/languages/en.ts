export const en = {
  invalidArguments: 'Invalid arguments',
  validationFailed: 'Validation failed',
  authenticationFailed: 'Authentication failed',
  resourceNotFound: 'Resource not found',
  userNotFound: 'User not found',
  conventionNotFound: 'Convention not found',
  usernamePasswordMismatch: 'Username and password mismatch',
  fieldAlreadyExists: 'Field already exists',
  usernameAlreadyExists: 'Username already exists',
  emailAlreadyExists: 'Email already exists',
  usernameLengthException: 'Username should be 4-20 characters long',
  passwordLengthException: 'Password should be 8-48 characters long',
  emailIsEmailException: 'Please enter a valid email address',
  registerSuccess: 'You are all set!',
  loginSuccess: (username: string) => `Welcome, ${username}`,
  logoutSuccess: 'Successfully logged out',
  passwordsNotConsistent: 'Password does not match the confirm password',
};
