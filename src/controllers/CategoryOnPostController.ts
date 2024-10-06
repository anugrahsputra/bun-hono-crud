import { Context } from "hono";
import prisma from "../../prisma/client";
import {
  errorResponse,
  successResponse,
} from "../api_response/default_response";

export async function getCategoryOnPosts(c: Context) {
  try {
    const page = parseInt(c.req.query("page") ?? "1");
    const limit = parseInt(c.req.query("limit") ?? "10");
    const skip = (page - 1) * limit;

    const cop = await prisma.categoryOnPost.findMany({
      include: {
        category: true,
        post: true,
      },
      skip: skip,
      take: limit,
    });

    return c.json(
      successResponse("Category on posts retrieved successfully", cop),
      200,
    );
  } catch (e: unknown) {
    return c.json(errorResponse("Error retrieving category on posts", e), 500);
  }
}
