import request from "supertest";
import { DataSource } from "typeorm";

import app from "../../src/app";
import { User } from "../../src/entity/User";
import { Roles } from "../../src/constants";
import { AppDataSource } from "../../src/config/data-source";
// import { truncateTable } from "../utils";

describe("POST /auth/register ", () => {
  let connection: DataSource;

  beforeAll(async () => {
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    await connection.dropDatabase();
    await connection.synchronize();
    // await truncateTable(connection);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  describe("Given all fields", () => {
    it("Should return the 201 status code", async () => {
      // AAA
      // Arrange
      const userData = {
        firstName: "Hello",
        lastName: "World",
        email: "hello@gmail.com",
        password: "Secret",
      };

      // Act
      const response = await request(app).post("/auth/register").send(userData);

      // Assert
      expect(response.statusCode).toBe(201);
    });

    it("Should return valid json response", async () => {
      // Arrange
      const userData = {
        firstName: "Hello",
        lastName: "World",
        email: "hello@gmail.com",
        password: "Secret",
      };

      // Act
      const response = await request(app).post("/auth/register").send(userData);

      // Assert
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json"),
      );
    });

    it("Should presist the user in the database", async () => {
      // Arrange
      const userData = {
        firstName: "Hello",
        lastName: "World",
        email: "hello@gmail.com",
        password: "Secret",
      };

      // Act
      await request(app).post("/auth/register").send(userData);

      // Assert
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users).toHaveLength(1);
      expect(users[0].firstName).toBe(userData.firstName);
      expect(users[0].lastName).toBe(userData.lastName);
      expect(users[0].email).toBe(userData.email);
    });

    it("Should assign a customer role", async () => {
      // Arrange
      const userData = {
        firstName: "Hello",
        lastName: "World",
        email: "hello@gmail.com",
        password: "Secret",
      };

      // Act
      await request(app).post("/auth/register").send(userData);

      // Assert
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users[0]).toHaveProperty("role");
      expect(users[0].role).toBe(Roles.CUSTOMER);
    });

    it("Should store the hashed password", async () => {
      // Arrange
      const userData = {
        firstName: "Hello",
        lastName: "World",
        email: "hello@gmail.com",
        password: "Secret",
      };

      // Act
      await request(app).post("/auth/register").send(userData);

      // Assert
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users[0].password).not.toBe(userData.password);
      expect(users[0].password).toHaveLength(60);
      expect(users[0].password).toMatch(/^\$2b\$\d+\$/);
    });

    it("Should return 400 status code of email is already exists", async () => {
      // Arrange
      const userData = {
        firstName: "Hello",
        lastName: "World",
        email: "hello@gmail.com",
        password: "Secret",
        role: Roles.CUSTOMER,
      };

      const userRepository = connection.getRepository(User);
      await userRepository.save(userData);

      // Act
      const response = await request(app).post("/auth/register").send(userData);
      const users = await userRepository.find();

      // Assert
      expect(response.statusCode).toBe(400);
      expect(users).toHaveLength(1);
    });
  });
});
