import { Request, Response } from "express";
import { UserModel } from "../database/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { mySchema, signinSchema } from "../types/schema";

dotenv.config();

export const signupController = async (req: Request, res: Response) => {
  const parseData = mySchema.safeParse(req.body);

  if (!parseData.success) {
    return res.status(400).json({
      msg: "Incorrect format",
      error: parseData.error,
    });
  }

  const { email, password, name } = parseData.data;

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ msg: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await UserModel.create({
      email,
      password: hashedPassword,
      name,
    });
    res.status(201).json({
      msg: "Signed up successfully",
    });
  } catch (error) {
    return res.status(500).json({ msg: "Error during signup" });
  }
};

export const signinController = async (req: Request, res: Response) => {
  const parseData = signinSchema.safeParse(req.body);

  if (!parseData.success) {
    return res.status(400).json({
      msg: "Invalid input",
      errors: parseData.error,
    });
  }

  const { email, password } = parseData.data;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const decryptPass = await bcrypt.compare(password, user.password);

    if (!decryptPass) {
      return res.status(401).json({ msg: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET as string, 
      {expiresIn: "7d"}
    );

    return res.status(200).json({
      msg: "Sucessfully Signed In",
      token,
    });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
