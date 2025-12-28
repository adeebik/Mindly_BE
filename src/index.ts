import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import userRouter from "./routes/user";
import noteRouter from "./routes/note";
import shareRouter from "./routes/share";
import cors from "cors"
dotenv.config();
const app = express();
app.use(express.json());

app.use(cors())

app.use("/users", userRouter);
app.use("/dashboard", noteRouter);
app.use("/share", shareRouter)

async function main() {
  try {
    await mongoose.connect(`${process.env.MONGO_URL}`);
    console.log("database connected");

    app.listen(process.env.PORT, () => {
      console.log(`app listening to port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("database connection error", error);
  }
}

main();