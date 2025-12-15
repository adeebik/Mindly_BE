import { Router } from "express";
import { createController, deleteController, updateController, getController } from "../controllers/crudController"

import { auth } from "../middleware/auth";

const noteRouter = Router();

noteRouter.get("/", auth, getController);
noteRouter.post("/create", auth, createController);
noteRouter.post("/update", auth, updateController);
noteRouter.post("/delete", auth, deleteController);

export default noteRouter;