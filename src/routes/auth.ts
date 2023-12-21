import express from "express";

import { User } from "../entity/User";
import { UserService } from "../services/UserService";
import { AppDataSource } from "../config/data-source";
import { AuthController } from "../controller/AuthController";
import { logger } from "../config/logger";

const authRouter = express.Router();
const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const authController = new AuthController(userService, logger);

// eslint-disable-next-line @typescript-eslint/no-misused-promises
authRouter.post("/register", (req, res, next) =>
  authController.register(req, res, next),
);

export default authRouter;
