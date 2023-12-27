import createHttpError from "http-errors";
import bcrypt from "bcrypt";

import { UserData } from "../types";
import { Roles } from "../constants";
import { Repository } from "typeorm";
import { User } from "../entity/User";

export class UserService {
  constructor(private userRepository: Repository<User>) {}

  async create({ firstName, lastName, email, password }: UserData) {
    // Unique Email
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (user) {
      const err = createHttpError(400, "Email is already existed");
      throw err;
    }

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

  async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findById(id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }
}
