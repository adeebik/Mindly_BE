import { Request, Response } from "express";
import { ContentModel } from "../database/db";
import { z } from "zod";
import mongoose from "mongoose";

export const getController = async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    const contents = await ContentModel.find({ userId: userId! }).populate("tags","title" , ).populate("userId" , "name");

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
  share: z.boolean().default(false)
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
  } catch (e) {
    res.status(500).json({
      msg: "Error creating Content",
      error: e,
    });
  }
};

export const deleteController = async (req: Request, res: Response) => {
  const userId = req.userId!;
  const { contentId } = req.body;

  try {
    const result = await ContentModel.deleteOne({ contentId, userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        msg: "Content not found ",
      });
    }
    res.status(200).json({
      msg: "Content Deleted!",
    });
  } catch (e) {
    res.status(200).json({ msg: "Error updating Content" });
  }
};

export const updateController = async (req: Request, res: Response) => {
  const userId = req.userId;
  const contentId = req.headers.contentId;

  if (!contentId) {
    return res.status(401);
  }

  const parsedData = contentSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res
      .status(400)
      .json({ msg: "Invalid content", errors: parsedData.error });
  }
  const { link, type, title, tags } = parsedData.data;
  try {
    const result = await ContentModel.updateOne(
      {
        userId: userId!,
        _id: contentId,
      },
      {
        link,
        type,
        title,
        tags,
      }
    );

    if (result.matchedCount === 0) {
      return res.status(401).json({ msg: "Content not found or unauthorized" });
    }
    res.status(200).json({ msg: "Content updated!" });
  } catch (error) {
    res.status(500).json({ msg: "Error updating Content" });
  }
};
