import express from "express";

import { User } from "../entity/User";
import { UserService } from "../services/UserService";
import { AppDataSource } from "../config/data-source";
import { AuthController } from "../controller/AuthController";

const authRouter = express.Router();
const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const authController = new AuthController(userService);

// eslint-disable-next-line @typescript-eslint/no-misused-promises
authRouter.post("/register", (req, res) => authController.register(req, res));

export default authRouter;
