import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../app";

describe("POST /auth/login", () => {

  it("should login successfully with valid credentials", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "test@test.com", password: "123456" });

    expect(res.status).toBe(200);
    expect(res.body.user).toBeDefined();
  });

  it("should return 401 for wrong email", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "wrong@test.com", password: "123456" });

    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/invalid/i);
  });

  it("should return 401 for wrong password", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "test@test.com", password: "wrongpassword" });

    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/invalid/i);
  });

  it("should return 400 for missing fields", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "" });

    expect(res.status).toBe(400);
  });

});
