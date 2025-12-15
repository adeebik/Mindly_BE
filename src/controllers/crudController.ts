// createController, deleteController, updateController, getController
import { Request, Response } from "express";
import { ContentModel } from "../database/db";
import { z } from "zod";
import mongoose from "mongoose";

export const getController = async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    const contents = await ContentModel.find({ userId: userId! }).populate(
      "tags",
      "title"
    );

    res.status(200).json({ contents });
  } catch (error) {
    res.status(500).json({ msg: "error Fetching contens" });
  }
};

const contentSchema = z.object({
  link: z.string().min(1),
  type: z.enum(["audio", "video", "link"]),
  title: z.string().min(1),
  tags: z.array(z.string()).optional().default([]),
});

export const createController = async (req: Request, res: Response) => {
  const userId = req.userId!;

  const parsedData = contentSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res
      .status(400)
      .json({ msg: "Invalid content", errors: parsedData.error });
  }
  const { link, type, title, tags } = parsedData.data;

  try {
    const tagObjectIds = tags.map(
      (tagId) => new mongoose.Types.ObjectId(tagId)
    );

    await ContentModel.create({
      link,
      type,
      title,
      tags: tagObjectIds,
      userId,
    });

    return res.status(201).json({
      msg: "Content created successfully",
      parsedData,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error creating todo",
    });
  }
};

export const deleteController = (req: Request, res: Response) => {};

export const updateController = (req: Request, res: Response) => {};
