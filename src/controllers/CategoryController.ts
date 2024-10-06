import { Context } from "hono";
import prisma from "../../prisma/client";
import {
  createApiResponse,
  errorResponse,
  successResponse,
} from "../api_response/default_response";

export async function getCategories(c: Context) {
  try {
    const categories = await prisma.category.findMany({});

    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const postCount = await prisma.categoryOnPost.count({
          where: {
            categoryId: category.id,
          },
        });

        return {
          id: category.id,
          name: category.name,
          postCount: postCount,
        };
      }),
    );

    return c.json(
      successResponse("Categories retrieved successfully", categoriesWithCount),
      200,
    );
  } catch (e: unknown) {
    return c.json(errorResponse("Error retrieving posts", e), 500);
  }
}

export async function getCategoryById(c: Context) {
  const id = parseInt(c.req.param("id"));

  try {
    const category = await prisma.category.findUnique({
      where: { id: id },
      include: {
        posts: {
          include: {
            post: true,
            category: true,
          },
        },
      },
    });

    if (!category) {
      return c.json(errorResponse(`Category with ID: ${id} not found`), 404);
    }

    return c.json(
      successResponse(`Detail data category by ID: ${id}`, category),
      200,
    );
  } catch (e: unknown) {
    console.log(e);
    return c.json(
      errorResponse(`Error retrieving category with ID: ${id}`, e),
      500,
    );
  }
}

export async function createCategory(c: Context) {
  try {
    const body = await c.req.json();

    const name =
      typeof body.name === "string" && body.name.length > 0
        ? body.name.charAt(0).toUpperCase() + body.name.slice(1)
        : "";

    const isExist = await prisma.category.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });

    if (isExist) {
      return c.json(errorResponse("Category already exist"), 400);
    }

    const category = await prisma.category.create({
      data: {
        name: name,
      },
    });

    const result = c.json(
      createApiResponse(true, "Category created successfully", category),
      200,
    );

    return result;
  } catch (e: unknown) {
    return c.json(createApiResponse(false, "Error creating category", e), 500);
  }
}
