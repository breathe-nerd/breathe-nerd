import { describe, it, expect } from "vitest";

describe("ENV test", () => {
  it("should load env variables", () => {
    console.log("ENV URL:", process.env.SUPABASE_URL);
    console.log("ENV KEY:", process.env.SUPABASE_SERVICE_KEY);

    expect(process.env.SUPABASE_URL).toBeDefined();
  });
});
