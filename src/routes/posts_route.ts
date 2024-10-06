import { Hono } from "hono";

import {
  getPosts,
  createPost,
  getPostById,
  updatePost,
} from "../controllers/PostsController";

const postsRouter = new Hono();

postsRouter.get("/", (c) => getPosts(c));

postsRouter.post("/create", (c) => createPost(c));

postsRouter.get("/:id", (c) => getPostById(c));

postsRouter.put("/:id", (c) => updatePost(c));

export const PostsRoute = postsRouter;
