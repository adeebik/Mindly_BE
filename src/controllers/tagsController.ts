import { Request, Response } from "express";
import z from "zod";
import { TagModel } from "../database/db";

const TagSchema = z.object({
  title: z
    .string("must be string")
    .min(1)
    .regex(/^\S+$/, "Must be a single word (no spaces)"),
});

export const tagsController = async ( req: Request , res: Response) => {
  const htags = TagSchema.safeParse(req.body);

  if (!htags.success) {
    return res.json({ msg: htags.error });
  }

  const { title } = htags.data;

  try {
    await TagModel.create({
      title,
    });
    return res.status(200).json({ msg: "tag added ", title });
  } catch (error) {
    return res.status(500).json({
      msg: "Error creating new Tag",
    });
  }
};
