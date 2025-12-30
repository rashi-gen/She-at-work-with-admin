import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/db"
import { CategoriesTable, UsersTable } from "@/db/schema"
import { eq, and, ne, sql } from "drizzle-orm"
import { z } from "zod"

/* ---------------------------------
   Validation
---------------------------------- */
const updateCategorySchema = z.object({
  name: z.string().min(1).optional(),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  parentId: z.string().uuid().nullable().optional(),
  sortOrder: z.number().optional(),
  contentTypes: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
})

/* ---------------------------------
   Helpers
---------------------------------- */
async function requireAdmin() {
  const session = await auth()

  if (!session?.user?.id) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }
  }

  const [user] = await db
    .select()
    .from(UsersTable)
    .where(eq(UsersTable.id, session.user.id))
    .limit(1)

  if (!user || !["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) }
  }

  return { user }
}

/* ---------------------------------
   GET Category
---------------------------------- */
export async function GET(_: NextRequest,  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const authCheck = await requireAdmin()
  if ("error" in authCheck) return authCheck.error

  const [category] = await db
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
    .where(eq(CategoriesTable.id, params.id))
    .limit(1)

  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 })
  }

  let parentCategory = null
  if (category.parentId) {
    const [parent] = await db
      .select({ id: CategoriesTable.id, name: CategoriesTable.name, slug: CategoriesTable.slug })
      .from(CategoriesTable)
      .where(eq(CategoriesTable.id, category.parentId))
      .limit(1)

    parentCategory = parent ?? null
  }

  return NextResponse.json({
    success: true,
    data: { ...category, parentCategory },
  })
}

/* ---------------------------------
   PATCH Category
---------------------------------- */
export async function PATCH(req: NextRequest,  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const authCheck = await requireAdmin()
  if ("error" in authCheck) return authCheck.error

  const body = await req.json()
  const data = updateCategorySchema.parse(body)

  const [existing] = await db
    .select()
    .from(CategoriesTable)
    .where(eq(CategoriesTable.id, params.id))
    .limit(1)

  if (!existing) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 })
  }

  if (data.slug && data.slug !== existing.slug) {
    const [duplicate] = await db
      .select()
      .from(CategoriesTable)
      .where(and(eq(CategoriesTable.slug, data.slug), ne(CategoriesTable.id, params.id)))
      .limit(1)

    if (duplicate) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 })
    }
  }

  if (data.parentId === params.id) {
    return NextResponse.json({ error: "Category cannot be its own parent" }, { status: 400 })
  }

  if (data.parentId) {
    const [parent] = await db
      .select()
      .from(CategoriesTable)
      .where(eq(CategoriesTable.id, data.parentId))
      .limit(1)

    if (!parent) {
      return NextResponse.json({ error: "Parent category not found" }, { status: 404 })
    }
  }

  const [updated] = await db
    .update(CategoriesTable)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(CategoriesTable.id, params.id))
    .returning()

  return NextResponse.json({ success: true, data: updated })
}

/* ---------------------------------
   DELETE Category (Soft Delete)
---------------------------------- */
export async function DELETE(_: NextRequest,   context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const authCheck = await requireAdmin()
  if ("error" in authCheck) return authCheck.error

  const [{ count }] = await db
    .select({ count: sql<string>`count(*)` })
    .from(CategoriesTable)
    .where(eq(CategoriesTable.parentId, params.id))

  if (Number(count) > 0) {
    return NextResponse.json(
      { error: "Delete subcategories first" },
      { status: 400 }
    )
  }

  await db
    .update(CategoriesTable)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(CategoriesTable.id, params.id))

  return NextResponse.json({ success: true, message: "Category deactivated" })
}
