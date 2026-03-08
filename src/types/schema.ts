import z from "zod";

export const mySchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(6).max(50),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name too long")
    .regex(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces"),
});

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const contentSchema = z.object({
  link: z.string().url("Must be a valid URL").min(1),
  type: z.enum(["youtube", "twitter"]),
  title: z.string().min(1).max(200, "Title too long"),
  description: z.string().optional().default(""),
  tags: z.array(z.string()).max(6, "Maximum 6 tags").optional().default([]),
});

export const TagSchema = z.object({
  title: z
    .string("must be string")
    .min(1)
    .regex(/^\S+$/, "Must be a single word (no spaces)")
    .toLowerCase(),
});
