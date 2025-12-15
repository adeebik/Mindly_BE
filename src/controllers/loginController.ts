import { Request, Response } from "express";
import { UserModel } from "../database/db";
import bcrypt from "bcrypt";
import z from "zod";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

export const signupController = async (req: Request, res: Response) => {
  const mySchema = z.object({
    email: z.string().email().trim().toLowerCase(),
    password: z.string().min(6).max(50),
    name: z
      .string()
      .regex(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces"),
  });

  const parseData = mySchema.safeParse(req.body);

  if (!parseData.success) {
    return res.status(400).json({
      msg: "Incorrect format",
      error: parseData.error,
    });
  }

  const { email, password, name } = parseData.data;

  try {
    const hashedPassword = await bcrypt.hash(password, 5);

    await UserModel.create({
      email,
      password: hashedPassword,
      name,
    });
    res.json({
      msg: "signed up sucessfully",
    });
  } catch (error) {}
  res.json({
    msg: "already signed in!",
  });
};

export const signinController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(403).json({ msg: "Invalid email or password" });
    }

    const decryptPass = await bcrypt.compare(password, user.password);

    if (!decryptPass) {
      return res.status(403).json({ msg: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    });

    return res.json({
      msg: "Sucessfully Signed In",
      token,
    });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
