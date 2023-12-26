import express, { NextFunction, Request, Response } from "express";

import { User } from "../entity/User";
import { logger } from "../config/logger";
import { UserService } from "../services/UserService";
import { AppDataSource } from "../config/data-source";
import { TokenService } from "../services/TokenService";
import { AuthController } from "../controller/AuthController";
import registerValidator from "../validators/register-validator";

const authRouter = express.Router();
const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const tokenService = new TokenService();
const authController = new AuthController(userService, logger, tokenService);

authRouter.post(
  "/register",
  registerValidator,
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  (req: Request, res: Response, next: NextFunction) =>
    authController.register(req, res, next),
);

export default authRouter;
