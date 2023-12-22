import createHttpError from "http-errors";
import bcrypt from "bcrypt";

import { UserData } from "../types";
import { Roles } from "../constants";
import { Repository } from "typeorm";
import { User } from "../entity/User";

export class UserService {
  constructor(private userRepository: Repository<User>) {}

  async create({ firstName, lastName, email, password }: UserData) {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      return await this.userRepository.save({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: Roles.CUSTOMER,
      });
    } catch (err) {
      const error = createHttpError(
        500,
        "Failed to store the data in the database",
      );
      throw error;
    }
  }
}
