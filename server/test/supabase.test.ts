import "dotenv/config";
import { describe, expect, it } from "vitest";
import { supabase } from "../db/supabaseClient.js";

describe("Supabase client", () => {
  it("connects to Supabase (basic check)", async () => {
    const { data, error } = await supabase
      .from("pg_tables")   // system table → always exists
      .select("tablename")
      .limit(1);

    console.log("DATA:", data);
    console.log("ERROR:", error);

    expect(error).toBeNull();
    expect(data).toBeDefined();
  }, 10000); // increase timeout
});