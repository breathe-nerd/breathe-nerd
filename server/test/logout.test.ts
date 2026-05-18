import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../app";

describe("POST /auth/logout", () => {
  it("should logout successfully and destroy session", async () => {
    const agent = request.agent(app);

    // simulate login
    await agent
      .post("/auth/login")
      .send({ email: "test@test.com", password: "123456" });

    // call logout
    const res = await agent.post("/auth/logout");

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/logout/i);

    // verify session is gone
    const protectedRes = await agent.get("/auth/me");

    expect(protectedRes.status).toBe(401);
  });
});
