import express from "express";
import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { supabase } from "../db/supabaseClient.js";

const router = express.Router();

// userId comes from session, not request body — prevents user from spoofing their own id
router.get("/verify", isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.session.userId;

    const { data: user, error } = await supabase
      .from("users")
      .select("id, email, name")
      .eq("id", userId)
      .single();

    if (error || !user) {
      return res.status(401).json({
        error: "Not authenticated",
      });
    }

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    return next(err);
  }
});

// destroy session server-side before clearing cookie so the session can't be reused
router.post("/logout", (req: Request, res: Response, next: NextFunction) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }


      // clear cookie so browser doesn't send a dead session on next request

      res.clearCookie("connect.sid");

      return res.status(200).json({
        message: "Logged out",
      });
    });
  } catch (err) {

    next(err);
  }
});

router.post("/signup", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        error: "User must provide correct name, email and password",
      });
    }

    const { data: existingUser, error: existingUserError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingUserError) {
      return next(existingUserError);
    }

    if (existingUser) {
      return res.status(409).json({
        error: "An account with that email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert({
        email,
        password: hashedPassword,
        name,
      })
      .select("id, email, name")
      .single();

    if (insertError || !newUser) {
      return next(insertError);
    }

    req.session.userId = newUser.id;

    return res.status(201).json({
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("id, email, name, password")
      .eq("email", email)
      .single();

    if (error || !user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    req.session.userId = user.id;

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    return next(err);
  }
});

export default router;