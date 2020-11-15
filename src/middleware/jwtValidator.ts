import jwt from "express-jwt";
import jwksRsa from "jwks-rsa";
import { auth as authConfig } from "../config";

// Authorization middleware. When used, the
// Access Token must exist and be verified against
// the Auth0 JSON Web Key Set
const validateJwt = jwt({
  // Dynamically provide a signing key
  // based on the kid in the header and
  // the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: authConfig.jwksUri,
  }),

  // Validate the audience and the issuer.
  audience: authConfig.audience,
  issuer: authConfig.issuer,
  algorithms: ["RS256"],
});

export { validateJwt };
