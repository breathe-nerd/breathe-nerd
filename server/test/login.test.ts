import "dotenv/config";
import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../app";

describe("POST /auth/login", () => {
  const testEmail = process.env.TEST_USER_EMAIL;
  const testPassword = process.env.TEST_USER_PASSWORD;

  if (!testEmail || !testPassword) {
    throw new Error("Missing TEST_USER_EMAIL or TEST_USER_PASSWORD in .env");
  }

  it("logs in with valid credentials", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        email: testEmail,
        password: testPassword,
      });

    expect(res.status).toBe(200);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe(testEmail);
    expect(res.body.user.password).toBeUndefined();
  }, 10000);

  it("returns 401 for wrong email", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        email: "wrong-user@example.com",
        password: testPassword,
      });

    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/invalid/i);
  }, 10000);

  it("returns 401 for wrong password", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        email: testEmail,
        password: "wrong-password",
      });

    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/invalid/i);
  }, 10000);

  it("returns 400 when email is missing", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        password: testPassword,
      });

    expect(res.status).toBe(400);
  });

  it("returns 400 when password is missing", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        email: testEmail,
      });

    expect(res.status).toBe(400);
  });
});