import { Router } from "express";
const shareRouter = Router();
import { auth } from "../middleware/auth";
import {
  contentShare,
  getContent,
  getMind,
  mindShare,
} from "../controllers/shareController";

shareRouter.post("/mindShare", auth, mindShare);
shareRouter.get("/mind/:ShareLink", getMind);
shareRouter.post("/contentShare", auth, contentShare);
shareRouter.get("/content/:ShareLink", getContent);

export default shareRouter;
