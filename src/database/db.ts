import mongoose, { Schema, Types } from "mongoose";

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    trim: true,
    required: true,
    lowercase: true,
  },
  password: { type: String, required: true },
  name:{type:String, required: true},
});

const ContentTypes = ["twitter", "youtube"];
const ContentSchema = new Schema({
  link: { type: String, required: true },
  type: { type: String, enum: ContentTypes, required: true },
  title: { type: String, required: true },
  description : {type: String},
  tags: [{ type: Types.ObjectId, ref: "tags" }],
  userId: { type: Types.ObjectId, ref: "users" , required: true},
});

const TagSchema = new Schema({
  title: { type: String, required: true, unique: true },
  userId: { type: Types.ObjectId, ref: "users" , required: true},
});

const LinkSchema = new Schema({
  hash: { type: String, required: true, unique:true},
  userId: { type: Types.ObjectId, ref: "users" , required:true},
});

const ContLinkSchema = new Schema({
  hash: { type: String, required: true, unique:true},
  userId: { type: Types.ObjectId, ref: "users" , required:true},
  contentId: {type: Types.ObjectId, ref: "contents", required:true}
});

const ContentModel = mongoose.model("contents", ContentSchema);
const UserModel = mongoose.model("users", UserSchema);
const TagModel = mongoose.model("tags", TagSchema);
const LinkModel = mongoose.model("links", LinkSchema);
const ContLinkModel = mongoose.model("contlinks", ContLinkSchema);

export { ContentModel, UserModel, TagModel, LinkModel, ContLinkModel };