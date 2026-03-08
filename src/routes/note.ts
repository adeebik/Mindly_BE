import { Router } from "express";
import {
  createController,
  deleteController,
  // updateController,
  getController,
} from "../controllers/crudController";

import { auth } from "../middleware/auth";
import { tagsController } from "../controllers/tagsController";

const noteRouter = Router();

noteRouter.use(auth)

noteRouter.get("/", getController);
noteRouter.post("/create", createController);
// noteRouter.post("/update", updateController);
noteRouter.post("/delete", deleteController);
noteRouter.post("/tag", tagsController);

export default noteRouter;