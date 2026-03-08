import { Router } from "express";
const shareRouter = Router();
import { auth } from "../middleware/auth";
import {
  contentShare,
  getContent,
  getMind,
  mindShare,
  getShareStatus,
  getAllContentShareStatus,
} from "../controllers/shareController";

shareRouter.post("/mindShare", auth, mindShare);
shareRouter.get("/mindShare", auth, getShareStatus);
shareRouter.get("/mind/:ShareLink", getMind);
shareRouter.post("/contentShare", auth, contentShare);
shareRouter.get("/contentShare", auth, getAllContentShareStatus);
shareRouter.get("/content/:ShareLink", getContent);

export default shareRouter;
