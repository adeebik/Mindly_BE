import { Request, Response } from "express";
import { ContentModel, ContLinkModel } from "../database/db";
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
  link: z.string().url("Must be a valid URL").min(1),
  type: z.enum(["youtube", "twitter"]),
  title: z.string().min(1).max(200, "Title too long"),
  description : z.string().optional().default(""),
  tags: z.array(z.string()).max(6, "Maximum 6 tags").optional().default([]),
});

export const createController = async (req: Request, res: Response) => {
  const userId = req.userId!;

  const parsedData = contentSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res
      .status(400)
      .json({ msg: "Invalid content", errors: parsedData.error });
  }
  const { link, type, title, tags , description} = parsedData.data;

  try {

    // AI HELP
     const tagObjectIds = tags.map(tagId => {
      if (!mongoose.Types.ObjectId.isValid(tagId)) {
        throw new Error(`Invalid tag ID: ${tagId}`);
      }
      return new mongoose.Types.ObjectId(tagId);
    });
    // 

    await ContentModel.create({
      link,
      type,
      title,
      description,
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
    const result = await ContentModel.deleteOne({ _id: contentId, userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        msg: "Content not found ",
      });
    }
     await ContLinkModel.deleteMany({ contentId });

    res.status(200).json({
      msg: "Content Deleted!",
    });
  } catch (e) {
    res.status(500).json({ msg: "Error updating Content" });
  }
};

export const updateController = async (req: Request, res: Response) => {
  const userId = req.userId;
  const contentId = req.body.contentId;

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
      return res.status(404).json({ msg: "Content not found or unauthorized" });
    }
    res.status(200).json({ msg: "Content updated!" });
  } catch (error) {
    res.status(500).json({ msg: "Error updating Content" });
  }
};
