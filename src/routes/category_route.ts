import { Hono } from "hono";

import {
  createCategory,
  getCategories,
  getCategoryById,
} from "../controllers/CategoryController";

const categoryRouter = new Hono();

categoryRouter.get("/", (c) => getCategories(c));
categoryRouter.post("/create", (c) => createCategory(c));
categoryRouter.get("/:id", (c) => getCategoryById(c));

export const CategoryRoute = categoryRouter;
