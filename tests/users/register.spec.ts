import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import { truncateTable } from "../utils";
import { User } from "../../src/entity/User";

describe("POST /auth/register ", () => {
  let connection: DataSource;

  beforeAll(async () => {
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    await truncateTable(connection);
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
      expect(users[0].password).toBe(userData.password);
    });
  });
});
