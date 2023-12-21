import { Response } from "express";
import { RegisterUserRequest } from "../types";
import { UserService } from "../services/UserService";

export class AuthController {
  constructor(private userService: UserService) {}

  async register(req: RegisterUserRequest, res: Response) {
    const { firstName, lastName, email, password } = req.body;
    await this.userService.create({ firstName, lastName, email, password });
    res.status(201).json();
  }
}

// Here, we have exported the class "AuthController",
// when ever we want to use it, we have to create a instance and after that we can use it. we are doing this to do "Dependency Injection"
