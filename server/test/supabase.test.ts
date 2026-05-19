import "dotenv/config";
import { describe, expect, it } from "vitest";
import { supabase } from "../db/supabaseClient.js";

const TEST_TIMEOUT = 10000;

describe("Supabase client", () => {
  it(
    "connects and queries the users table",
    async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id")
        .limit(1);

      if (error) {
        console.error("Supabase error:", error);
      }

      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
    },
    TEST_TIMEOUT
  );
});