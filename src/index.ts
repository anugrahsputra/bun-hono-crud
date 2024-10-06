import { Hono } from "hono";
import { CategoryRoute } from "./routes/category_route";
import { PostsRoute } from "./routes/posts_route";
import { CopRoute } from "./routes/cop_route";

const app = new Hono();

app.route("/posts", PostsRoute);
app.route("/categories", CategoryRoute);
app.route("/category-on-posts", CopRoute);

export default app;
