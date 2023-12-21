import { Request, Response } from "express";

export class AuthController {
  register(req: Request, res: Response) {
    res.status(201).json();
  }
}

// Here, we have exported the class, when ever we want to use it, we have to create a instance and after that we can use it. we are doing this to do "Dependency Injection"
