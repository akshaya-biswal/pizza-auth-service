import request from "supertest";
import { DataSource } from "typeorm";

import app from "../../src/app";
import { AppDataSource } from "../../src/config/data-source";

describe("GET /auth/self ", () => {
  let connection: DataSource;

  beforeAll(async () => {
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    await connection.dropDatabase();
    await connection.synchronize();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  describe("Given all fields", () => {
    it("Should return the 200 status code", async () => {
      const response = await request(app).post("/auth/self").send();
      expect(response.statusCode).toBe(200);
    });
  });
});
