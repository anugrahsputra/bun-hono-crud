import { Hono } from "hono";

import { getCategoryOnPosts } from "../controllers/CategoryOnPostController";

const copRouter = new Hono();

copRouter.get("/", (c) => getCategoryOnPosts(c));

export const CopRoute = copRouter;
