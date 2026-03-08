import { Request, Response } from "express";
import { TagModel, ContentModel } from "../database/db";
import { TagSchema } from "../types/schema";

export const tagsController = async (req: Request, res: Response) => {
  const parsedTag = TagSchema.safeParse(req.body);

  if (!parsedTag.success) {
    return res.status(400).json({
      msg: "Invalid tag",
      errors: parsedTag.error,
    });
  }

  const { title } = parsedTag.data;

  try {

    const existingTag = await TagModel.findOne({ title });
    if (existingTag) {
      return res.status(200).json({
        msg: "Tag already exists",
        tag: existingTag,
      });
    }

    const newTag = await TagModel.create({ 
      title,
      userId: req.userId as any
    });

    return res.status(201).json({
      msg: "Tag created successfully",
      tag: newTag,
    });

  } catch (error) {
    console.error("Error creating tag:", error);
    return res.status(500).json({
      msg: "Error creating tag",
    });
  }
  
};

export const getAllTagsController = async (req: Request, res: Response) => {
  try {
    const tags = await TagModel.find({ userId: req.userId as any }).sort({ title: 1 });
    res.status(200).json({ tags });
  } catch (error) {
    console.error("Error fetching tags:", error);
    res.status(500).json({ msg: "Error fetching tags" });
  }
};

export const deleteTagController = async (req: Request, res: Response) => {
  const { tagId } = req.params;
  const userId = req.userId;

  try {
    const result = await TagModel.deleteOne({ _id: tagId, userId: userId as any });

    if (result.deletedCount === 0) {
      return res.status(404).json({ msg: "Tag not found or unauthorized" });
    }

    // Pull the tag reference from all content documents belonging to the user
    await ContentModel.updateMany(
      { userId: userId as any },
      { $pull: { tags: tagId } }
    );

    res.status(200).json({ msg: "Tag deleted successfully" });
  } catch (error) {
    console.error("Error deleting tag:", error);
    res.status(500).json({ msg: "Error deleting tag" });
  }
};
