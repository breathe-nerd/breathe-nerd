import "dotenv/config";
import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../app";

const ROUTES = {
  LOGIN: "/auth/login",
};

const STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
};

const TEST_DATA = {
  VALID_EMAIL: process.env.TEST_USER_EMAIL!,
  VALID_PASSWORD: process.env.TEST_USER_PASSWORD!,
  INVALID_EMAIL: process.env.TEST_INVALID_EMAIL!,
  INVALID_PASSWORD: process.env.TEST_INVALID_PASSWORD!,
};

describe("POST /auth/login", () => {
  it("logs in with valid credentials", async () => {
    const res = await request(app)
      .post(ROUTES.LOGIN)
      .send({
        email: TEST_DATA.VALID_EMAIL,
        password: TEST_DATA.VALID_PASSWORD,
      });

    expect(res.status).toBe(STATUS.OK);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe(TEST_DATA.VALID_EMAIL);
    expect(res.body.user.password).toBeUndefined();
  }, 10000);

  it("returns unauthorized for wrong email", async () => {
    const res = await request(app)
      .post(ROUTES.LOGIN)
      .send({
        email: TEST_DATA.INVALID_EMAIL,
        password: TEST_DATA.VALID_PASSWORD,
      });

    expect(res.status).toBe(STATUS.UNAUTHORIZED);
    expect(res.body.error).toMatch(/invalid/i);
  });

  it("returns unauthorized for wrong password", async () => {
    const res = await request(app)
      .post(ROUTES.LOGIN)
      .send({
        email: TEST_DATA.VALID_EMAIL,
        password: TEST_DATA.INVALID_PASSWORD,
      });

    expect(res.status).toBe(STATUS.UNAUTHORIZED);
    expect(res.body.error).toMatch(/invalid/i);
  });

  it("returns bad request when email is missing", async () => {
    const res = await request(app)
      .post(ROUTES.LOGIN)
      .send({
        password: TEST_DATA.VALID_PASSWORD,
      });

    expect(res.status).toBe(STATUS.BAD_REQUEST);
  });

  it("returns bad request when password is missing", async () => {
    const res = await request(app)
      .post(ROUTES.LOGIN)
      .send({
        email: TEST_DATA.VALID_EMAIL,
      });

    expect(res.status).toBe(STATUS.BAD_REQUEST);
  });
});