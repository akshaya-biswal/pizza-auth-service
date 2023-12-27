/*
- Here, we have exported the class "AuthController",
- when ever we want to use it, we have to create a instance and after that we can use it. we are doing this to do "Dependency Injection"
*/

import { Logger } from "winston";
import { JwtPayload } from "jsonwebtoken";
import createHttpError from "http-errors";
import { NextFunction, Response } from "express";

import { RegisterUserRequest } from "../types";
import { validationResult } from "express-validator";
// Services
import { UserService } from "../services/UserService";
import { TokenService } from "../services/TokenService";
import { CredentialService } from "../services/CredentialService";

export class AuthController {
  constructor(
    private logger: Logger,
    private userService: UserService,
    private tokenService: TokenService,
    private credentialService: CredentialService,
  ) {}

  async register(req: RegisterUserRequest, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    const { firstName, lastName, email, password } = req.body;

    this.logger.debug("New request to register a user", {
      firstName,
      lastName,
      email,
      password: "******",
    });
    try {
      const user = await this.userService.create({
        firstName,
        lastName,
        email,
        password,
      });

      this.logger.info("User has been registered", { id: user.id });

      const payload: JwtPayload = {
        sub: String(user.id),
        role: user.role,
      };

      const accessToken = this.tokenService.generateAccessToken(payload);

      // Persist the refresh token
      const newRefreshToken = await this.tokenService.presistRefreshToken(user);

      const refreshToken = this.tokenService.generateRefreshToken({
        ...payload,
        id: String(newRefreshToken.id),
      });

      res.cookie("accessToken", accessToken, {
        domain: "localhost",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60,
        httpOnly: true,
      });

      res.cookie("refreshToken", refreshToken, {
        domain: "localhost",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 365,
        httpOnly: true,
      });

      res.status(201).json({ id: user.id });
    } catch (err) {
      next(err);
      return;
    }
  }

  async login(req: RegisterUserRequest, res: Response, next: NextFunction) {
    // Validation
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const { email, password } = req.body;

    this.logger.debug("New request to login a user", {
      email,
      password: "******",
    });

    try {
      // Check if username (email) exists in database
      const user = await this.userService.findByEmail(email);
      if (!user) {
        const error = createHttpError(400, "Email and password doesn't match");
        next(error);
        return;
      }

      // Compare password
      const passwordMatch = await this.credentialService.comparePassword(
        password,
        user.password,
      );

      if (!passwordMatch) {
        const error = createHttpError(400, "Email and password doesn't match");
        next(error);
        return;
      }

      // Generate tokens
      const payload: JwtPayload = {
        sub: String(user.id),
        role: user.role,
      };

      const accessToken = this.tokenService.generateAccessToken(payload);

      // Persist the refresh token
      const newRefreshToken = await this.tokenService.presistRefreshToken(user);

      const refreshToken = this.tokenService.generateRefreshToken({
        ...payload,
        id: String(newRefreshToken.id),
      });

      // Add tokens to Cookies
      res.cookie("accessToken", accessToken, {
        domain: "localhost",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60,
        httpOnly: true,
      });

      res.cookie("refreshToken", refreshToken, {
        domain: "localhost",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 365,
        httpOnly: true,
      });

      this.logger.info("User has been logged in", { id: user.id });

      // Return the response (id)
      res.status(200).json({ id: user.id });
    } catch (err) {
      next(err);
      return;
    }
  }
}
