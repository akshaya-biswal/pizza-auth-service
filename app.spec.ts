import request from "supertest";

import app from "./src/app";
import { caluculateDiscount } from "./src/utils";

describe("App", () => {
  it("should calculate", () => {
    const result = caluculateDiscount(100, 20);
    expect(result).toBe(20);
  });

  it("should return 200", async () => {
    const response = await request(app).get("/").send();
    expect(response.statusCode).toBe(200);
  });
});
