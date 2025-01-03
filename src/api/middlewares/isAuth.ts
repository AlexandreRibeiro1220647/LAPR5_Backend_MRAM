// remove by JRT : import jwt from 'express-jwt';
var { expressjwt: jwt } = require("express-jwt");
const jwksRsa = require('jwks-rsa');
import config from '../../../config';

const isAuth = (requiredRoles = []) => {
  // JWT validation middleware
  const jwtMiddleware = jwt({
    secret: jwksRsa.expressJwtSecret({
      jwksUri: `https://${config.AUTH0_DOMAIN}/.well-known/jwks.json`
    }),
    audience: config.AUTH0_CLIENT_ID,
    issuer: `https://${config.AUTH0_DOMAIN}/`,
    algorithms: ['RS256']
  });

  // Authorization middleware
  return [
    jwtMiddleware,
    (req, res, next) => {

      // Ensure the JWT token contains the necessary claims
      const user = req.auth;

      if (!user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      // Check if the user is email verified (note: email_verified is a boolean)
      if (user.email_verified !== true) {
        return res.status(401).json({ message: 'Email is not verified' });
      }

      // Check if the user has at least one of the required roles
      const roles = user['https://hellth.com/claims/roles']; // Correct role claim path
      if (!roles || !roles.some(role => requiredRoles.includes(role))) {
        return res.status(403).json({ message: 'Forbidden: Insufficient role' });
      }

      // Allow the request to proceed if all checks pass
      next();
    }
  ];
};

export default isAuth;
