import { Router } from "express";
import { createController, deleteController, updateController, getController } from "../controllers/crudController"

import { auth } from "../middleware/auth";
import { tagsController } from "../controllers/tagsController";

const noteRouter = Router();

noteRouter.get("/", auth, getController);
noteRouter.post("/create", auth, createController);
noteRouter.post("/update", auth, updateController);
noteRouter.post("/delete", auth, deleteController);
noteRouter.post("/tag", auth, tagsController)


export default noteRouter;