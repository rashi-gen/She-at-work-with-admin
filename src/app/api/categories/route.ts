/*eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/db"
import { CategoriesTable, UsersTable } from "@/db/schema"
import { eq, and, desc, ilike, inArray, sql } from "drizzle-orm"
import { z } from "zod"

/* ---------------------------------
   Validation Schemas
---------------------------------- */
const createCategorySchema = z.object({
  name: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().optional(),
  image: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  parentId: z.string().uuid().nullable().optional(),
  sortOrder: z.number().default(0),
  contentTypes: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
})

// const updateCategorySchema = createCategorySchema.partial()

/* ---------------------------------
   GET Categories
---------------------------------- */
export async function GET(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // /* ---- Admin Check ---- */
    // const [user] = await db
    //   .select()
    //   .from(UsersTable)
    //   .where(eq(UsersTable.id, session.user.id))
    //   .limit(1)
    /* ---- Query Params ---- */
    const { searchParams } = req.nextUrl
    const search = searchParams.get("search") ?? ""
    const status = searchParams.get("status")
    const page = Number(searchParams.get("page") ?? 1)
    const limit = Number(searchParams.get("limit") ?? 20)
    const offset = (page - 1) * limit

    /* ---- Conditions ---- */
    const conditions = []

    if (search) {
      conditions.push(ilike(CategoriesTable.name, `%${search}%`))
    }

    if (status === "active") {
      conditions.push(eq(CategoriesTable.isActive, true))
    }

    if (status === "inactive") {
      conditions.push(eq(CategoriesTable.isActive, false))
    }

    /* ---- Count ---- */
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(CategoriesTable)
      .where(conditions.length ? and(...conditions) : undefined)

    /* ---- Data ---- */
    const categories = await db
      .select({
        id: CategoriesTable.id,
        name: CategoriesTable.name,
        slug: CategoriesTable.slug,
        description: CategoriesTable.description,
        image: CategoriesTable.image,
        icon: CategoriesTable.icon,
        color: CategoriesTable.color,
        parentId: CategoriesTable.parentId,
        sortOrder: CategoriesTable.sortOrder,
        contentTypes: CategoriesTable.contentTypes,
        isActive: CategoriesTable.isActive,
        isFeatured: CategoriesTable.isFeatured,
        createdAt: CategoriesTable.createdAt,
        updatedAt: CategoriesTable.updatedAt,
        creator: {
          id: UsersTable.id,
          name: UsersTable.name,
          email: UsersTable.email,
        },
      })
      .from(CategoriesTable)
      .leftJoin(UsersTable, eq(CategoriesTable.createdBy, UsersTable.id))
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(CategoriesTable.sortOrder, desc(CategoriesTable.createdAt))
      .limit(limit)
      .offset(offset)

    /* ---- Parent Categories ---- */
    const parentIds = categories
      .map(c => c.parentId)
      .filter((id): id is string => Boolean(id))

    let parents: any[] = []
    if (parentIds.length) {
      parents = await db
        .select({
          id: CategoriesTable.id,
          name: CategoriesTable.name,
          slug: CategoriesTable.slug,
        })
        .from(CategoriesTable)
        .where(inArray(CategoriesTable.id, parentIds))
    }

    const data = categories.map(cat => ({
      ...cat,
      parentCategory: cat.parentId
        ? parents.find(p => p.id === cat.parentId) ?? null
        : null,
    }))

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit),
      },
    })
  } catch (error) {
    console.error("Categories GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/* ---------------------------------
   POST Category
---------------------------------- */
export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [user] = await db
      .select()
      .from(UsersTable)
      .where(eq(UsersTable.id, session.user.id))
      .limit(1)

    if (!user || !["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const data = createCategorySchema.parse(body)

    /* ---- Slug Check ---- */
    const [existing] = await db
      .select()
      .from(CategoriesTable)
      .where(eq(CategoriesTable.slug, data.slug))
      .limit(1)

    if (existing) {
      return NextResponse.json(
        { error: "Category slug already exists" },
        { status: 409 }
      )
    }

    /* ---- Parent Check ---- */
    if (data.parentId) {
      const [parent] = await db
        .select()
        .from(CategoriesTable)
        .where(eq(CategoriesTable.id, data.parentId))
        .limit(1)

      if (!parent) {
        return NextResponse.json(
          { error: "Parent category not found" },
          { status: 404 }
        )
      }
    }

    const [category] = await db
      .insert(CategoriesTable)
      .values({
        ...data,
        createdBy: session.user.id,
      })
      .returning()

    return NextResponse.json(
      { success: true, data: category },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Category POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
