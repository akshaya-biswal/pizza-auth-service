import express, { NextFunction, Request, Response } from "express";

// Config
import { logger } from "../config/logger";
import { AppDataSource } from "../config/data-source";
// Entiry
import { User } from "../entity/User";
import { RefreshToken } from "../entity/RefreshToken";
// Validators
import loginValidator from "../validators/login-validator";
import registerValidator from "../validators/register-validator";
// Services
import { UserService } from "../services/UserService";
import { TokenService } from "../services/TokenService";
// Controller
import { AuthController } from "../controller/AuthController";
import { CredentialService } from "../services/CredentialService";

const authRouter = express.Router();

const userRepository = AppDataSource.getRepository(User);
const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);

const userService = new UserService(userRepository);
const tokenService = new TokenService(refreshTokenRepository);
const credentialService = new CredentialService();
const authController = new AuthController(
  logger,
  userService,
  tokenService,
  credentialService,
);

authRouter.post(
  "/register",
  registerValidator,
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  (req: Request, res: Response, next: NextFunction) =>
    authController.register(req, res, next),
);

authRouter.post(
  "/login",
  loginValidator,
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  (req: Request, res: Response, next: NextFunction) =>
    authController.login(req, res, next),
);

export default authRouter;
