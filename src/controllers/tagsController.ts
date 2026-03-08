import { Request, Response } from "express";
import { TagModel } from "../database/db";
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

    const newTag = await TagModel.create({ title });

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
    const tags = await TagModel.find().sort({ title: 1 });
    res.status(200).json({ tags });
  } catch (error) {
    console.error("Error fetching tags:", error);
    res.status(500).json({ msg: "Error fetching tags" });
  }
};
