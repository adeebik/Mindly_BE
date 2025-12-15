import { Router } from "express";
import { signinController, signupController } from "../controllers/loginController";

const userRouter = Router(); 

userRouter.post("/signup", signupController);
userRouter.post("/signin", signinController);

export default userRouter;