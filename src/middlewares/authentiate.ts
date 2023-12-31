import { Request } from "express";
import jwksClient from "jwks-rsa";
import { GetVerificationKey, expressjwt } from "express-jwt";

import { Config } from "../config";

export default expressjwt({
  secret: jwksClient.expressJwtSecret({
    jwksUri: Config.JWKS_URI!,
    cache: true,
    rateLimit: true,
  }) as GetVerificationKey,
  algorithms: ["RS256"],
  getToken(req: Request) {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.split(" ")[1] !== "undefined") {
      const token = authHeader.split(" ")[1];
      if (token) {
        return token;
      }
    }

    type AuthCookie = {
      accessToken: string;
    };

    const { accessToken } = req.cookies as AuthCookie;
    return accessToken;
  },
});
