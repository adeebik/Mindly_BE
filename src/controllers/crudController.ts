import { Request, Response } from "express";
import { ContentModel, ContLinkModel } from "../database/db";
import mongoose from "mongoose";
import { contentSchema } from "../types/schema";

export const getController = async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    const contents = await ContentModel.find({ userId: userId! })
      .populate("tags", "title")
      .populate("userId", "name");

    res.status(200).json({ contents });
  } catch (error) {
    res.status(500).json({ msg: "error Fetching contens" });
  }
};

export const createController = async (req: Request, res: Response) => {
  const userId = req.userId!;

  const parsedData = contentSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res
      .status(400)
      .json({ msg: "Invalid content", errors: parsedData.error });
  }
  const { link, type, title, tags, description } = parsedData.data;

  try {
    // AI HELP
    const tagObjectIds = tags.map((tagId) => {
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
  } catch (error) {
    console.error("Error creating content:", error);
    res.status(500).json({
      msg: "Error creating Content",
      error: error,
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

    await ContLinkModel.deleteOne({ contentId });

    res.status(200).json({
      msg: "Content Deleted!",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ msg: "Error Deleting Content" });
  }
};

// export const updateController = async (req: Request, res: Response) => {
//   const userId = req.userId;
//   const contentId = req.body.contentId;

//   if (!contentId) {
//     return res.status(401);
//   }

//   const parsedData = contentSchema.safeParse(req.body);
//   if (!parsedData.success) {
//     return res
//       .status(400)
//       .json({ msg: "Invalid content", errors: parsedData.error });
//   }
//   const { link, type, title, tags } = parsedData.data;
//   try {
//     const result = await ContentModel.updateOne(
//       {
//         userId: userId!,
//         _id: contentId,
//       },
//       {
//         link,
//         type,
//         title,
//         tags,
//       },
//     );

//     if (result.matchedCount === 0) {
//       return res.status(404).json({ msg: "Content not found or unauthorized" });
//     }
//     res.status(200).json({ msg: "Content updated!" });
//   } catch (error) {
//     res.status(500).json({ msg: "Error updating Content" });
//   }
// };
