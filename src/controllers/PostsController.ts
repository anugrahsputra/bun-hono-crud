import { Context } from "hono";
import prisma from "../../prisma/client";
import {
  errorResponse,
  successResponse,
} from "../api_response/default_response";

export async function getPosts(c: Context) {
  try {
    const page = parseInt(c.req.query("page") ?? "1");
    const limit = parseInt(c.req.query("limit") ?? "10");

    const skip = (page - 1) * limit;

    const posts = await prisma.posts.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
      skip: skip,
      take: limit,
    });

    return c.json(
      {
        success: true,
        message: "Posts retrieved successfully",
        data: posts,
      },
      200,
    );
  } catch (e: unknown) {
    return c.json(
      { success: false, message: "Error retrieving posts", error_detail: e },
      500,
    );
  }
}

export async function createPost(c: Context) {
  try {
    const body = await c.req.json();

    const title = typeof body.title === "string" ? body.title : "";
    const content = typeof body.content === "string" ? body.content : "";

    if (!title || !content) {
      return c.json(
        { success: false, message: "Title and content are required" },
        400,
      );
    }
    const categories = Array.isArray(body.categories) ? body.categories : [];

    const categoryExist = await prisma.category.findMany({
      where: {
        name: {
          in: categories,
          mode: "insensitive",
        },
      },
    });

    const existingCategories = categoryExist.map((category) => category.id);

    const missingCategories = categories.filter(
      (category: string) =>
        !categoryExist.some(
          (c) => c.name.toLowerCase() === category.toLowerCase(),
        ),
    );

    const newCategories = await Promise.all(
      missingCategories.map(async (name: string) => {
        const newCategory = await prisma.category.create({
          data: {
            name: name,
          },
        });
        return newCategory.id; // Return the new category ID
      }),
    );

    const allCategories = [...existingCategories, ...newCategories];

    const post = await prisma.posts.create({
      data: {
        title: title,
        content: content,
        categories: {
          create: allCategories.map((categoryId) => ({
            category: {
              connect: { id: categoryId }, // Connect to existing categories by ID
            },
          })),
        },
      },
      include: {
        categories: {
          include: {
            category: true, // Include the category details in the response
          },
        },
      },
    });

    return c.json(successResponse("Post created successfully", post), 200);
  } catch (e: unknown) {
    return c.json(
      { success: false, message: "Error creating post", error_detail: e },
      500,
    );
  }
}

export async function getPostById(c: Context) {
  const id = parseInt(c.req.param("id"));
  try {
    const post = await prisma.posts.findUnique({
      where: { id: id },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!post) {
      return c.json(errorResponse(`Post with ID: ${id} not found`), 404);
    }

    return c.json(successResponse(`Detail data post by ID: ${id}`, post), 200);
  } catch (e: unknown) {
    console.log(e);
    return c.json(
      errorResponse(`Error retrieving post with ID: ${id}`, e),
      500,
    );
  }
}

export async function updatePost(c: Context) {
  const id = parseInt(c.req.param("id"));
  try {
    const body = await c.req.json();

    const existingPost = await prisma.posts.findUnique({
      where: { id: id },
      include: { categories: { include: { category: true } } },
    });

    if (!existingPost) {
      return c.json(
        { success: false, message: `Post with ID: ${id} not found` },
        404,
      );
    }

    const title =
      typeof body.title === "string" ? body.title : existingPost.title;
    const content =
      typeof body.content === "string" ? body.content : existingPost.content;
    const categories = Array.isArray(body.categories) ? body.categories : [];

    const categoryExist = await prisma.category.findMany({
      where: {
        name: {
          in: categories,
          mode: "insensitive",
        },
      },
    });

    const existingCategories = categoryExist.map((category) => category.id);

    const missingCategories = categories.filter(
      (category: string) =>
        !categoryExist.some(
          (c) => c.name.toLowerCase() === category.toLowerCase(),
        ),
    );

    const newCategories = await Promise.all(
      missingCategories.map(async (name: string) => {
        const newCategory = await prisma.category.create({
          data: { name: name },
        });
        return newCategory.id;
      }),
    );

    const allCategories = [...existingCategories, ...newCategories];

    const post = await prisma.posts.update({
      where: { id: id },
      data: {
        title: title,
        content: content,
        categories: {
          deleteMany: {},
          create: allCategories.map((categoryId) => ({
            category: {
              connect: { id: categoryId },
            },
          })),
        },
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    return c.json(
      successResponse(`Post with ID: ${id} updated successfully`, post),
      200,
    );
  } catch (e: unknown) {
    console.log(e);
    return c.json(errorResponse(`Error updating post with ID: ${id}`, e), 500);
  }
}
