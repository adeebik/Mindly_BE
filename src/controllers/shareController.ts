import { Request, Response } from "express";
import { ContentModel, ContLinkModel, LinkModel } from "../database/db";
import { random } from "../utils/random";
import * as dotenv from "dotenv";
dotenv.config();

export const mindShare = async (req: Request, res: Response) => {
  const share = req.body.share;
  const userId = req.userId!;

  if (share) {
    try {
      const existingLink = await LinkModel.findOne({ userId });

      if (existingLink) {
        const hashlink = existingLink.hash;
        return res.status(200).json({
          link: hashlink,
          msg: "Link already exists",
        });
      }

      const hash = random(14);

      await LinkModel.create({
        hash,
        userId,
      });

      res.status(201).json({
        link: hash,
        msg: "Link created successfully",
      });
    } catch (error) {
      res.status(500).json({ msg: "Unexpected Problem Occurred" });
    }
  } else {
    try {
      const removeLink = await LinkModel.deleteOne({ userId });
      if (removeLink.deletedCount === 0) {
        return res.status(404).json({
          msg: "Link not found ",
        });
      }
      res.status(200).json({
        msg: "Link Deleted!",
      });
    } catch (error) {
      res.json({ msg: "Unexpected error while deleting link" });
    }
  }
};

export const getShareStatus = async (req: Request, res: Response) => {
  const userId = req.userId!;

  try {
    const existingLink = await LinkModel.findOne({ userId });
    if (existingLink) {
      return res.status(200).json({
        isShared: true,
        link: existingLink.hash,
      });
    }
    return res.status(200).json({
      isShared: false,
    });
  } catch (error) {
    res.status(500).json({ msg: "Unexpected Problem Occurred" });
  }
};

export const getMind = async (req: Request, res: Response) => {
  const hash = req.params.ShareLink;

  if (!hash) {
    return res.status(400).json({ msg: "Invalid link" });
  }

  try {
    const link = await LinkModel.findOne({ hash });
    if (!link) {
      return res.status(404).json({ msg: "link is invalid or not found" });
    }

    const userId = link.userId.toString();

    const contents = await ContentModel.find({ userId })
      .populate("userId", "name")
      .populate("tags", "title");

    return res.status(200).json({
      contents,
    });
  } catch (error) {
    return res.status(404).json({
      msg: "Page not found",
    });
  }
};

export const getAllContentShareStatus = async (req: Request, res: Response) => {
  const userId = req.userId!;

  try {
    const sharedLinks = await ContLinkModel.find({ userId });

    const sharedContents: Record<string, { link: string; isShared: boolean }> =
      {};
    sharedLinks.forEach((link) => {
      sharedContents[link.contentId.toString()] = {
        link: link.hash,
        isShared: true,
      };
    });

    return res.status(200).json({
      sharedContents,
    });
  } catch (error) {
    res.status(500).json({ msg: "Unexpected Problem Occurred" });
  }
};

export const contentShare = async (req: Request, res: Response) => {
  const { share, contentId } = req.body;
  const userId = req.userId!;

  if (share) {
    try {
      const checkContentExists = await ContentModel.findById(contentId);

      if (!checkContentExists) {
        return res
          .status(401)
          .json({ msg: "Content Does Not Exists or Invalid" });
      }

      const existingLink = await ContLinkModel.findOne({
        userId,
        contentId,
      });

      if (existingLink) {
        const hashlink = existingLink.hash;
        return res.status(200).json({
          link: hashlink,
          msg: "Link already exists",
        });
      }

      const hash = random(14);

      await ContLinkModel.create({
        hash,
        userId,
        contentId,
      });

      res.status(201).json({
        link: hash,
        msg: "Link created successfully",
      });
    } catch (error) {
      res.status(500).json({ msg: "Unexpected Problem Occurred" });
    }
  } else {
    try {
      const removeLink = await ContLinkModel.deleteOne({ userId, contentId });
      if (removeLink.deletedCount === 0) {
        return res.status(404).json({
          msg: "Link not found ",
        });
      }
      res.status(200).json({
        msg: "Link Deleted!",
      });
    } catch (error) {
      res.json({ msg: "Unexpected error while deleting link" });
    }
  }
};

export const getContent = async (req: Request, res: Response) => {
  const hash = req.params.ShareLink!;

  try {
    const link = await ContLinkModel.findOne({ hash });

    if (!link) {
      return res.status(404).json({ msg: "link is invalid or not found" });
    }

    const contentId = link.contentId.toString();

    const content = await ContentModel.findOne({ _id: contentId })
      .populate("userId", "name")
      .populate("tags", "title");

    return res.status(200).json({
      content,
    });
  } catch (error) {
    return res.status(404).json({
      msg: "Page not found",
    });
  }
};
