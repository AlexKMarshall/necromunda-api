import dotenv from "dotenv";
dotenv.config();

const validate = (variable: string) => {
  const value = process.env[variable];
  if (!value) {
    throw new Error(`Missing environment variable: ${variable}`);
  }
  return value;
};

export const port = validate("PORT");
export const databaseUrl = validate("DATABASE_URI");
export const api = {
  prefix: validate("API_PREFIX"),
};
export const auth = {
  jwksUri: validate("JWKS_URI"),
  audience: validate("AUDIENCE"),
  issuer: validate("ISSUER"),
};
