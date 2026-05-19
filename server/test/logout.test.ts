import "dotenv/config";
import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../server.js";

describe("POST /auth/logout", () => {
  it("logs out successfully and destroys the session", async () => {
    const agent = request.agent(app);

    await agent
      .post("/auth/login")
      .send({
        email: process.env.TEST_USER_EMAIL,
        password: process.env.TEST_USER_PASSWORD,
      });

    const logoutRes = await agent.post("/auth/logout");

    expect(logoutRes.status).toBe(200);
    expect(logoutRes.body.message).toMatch(/logout/i);

    const protectedRes = await agent.get("/auth/me");

    expect(protectedRes.status).toBe(401);
  }, 10000);
});
