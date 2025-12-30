/*eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/db"
import { CategoriesTable, UsersTable } from "@/db/schema"
import { eq } from "drizzle-orm"

/* ---------------------------------
   Types
---------------------------------- */
type CategoryRow = {
  id: string
  name: string
  slug: string
  parentId: string | null
  sortOrder: number | null   // ✅ allow null
  isActive: boolean
}

type CategoryTreeNode = Omit<CategoryRow, "sortOrder"> & {
  sortOrder: number          // normalized
  children: CategoryTreeNode[]
}

/* ---------------------------------
   GET Category Tree
---------------------------------- */
export async function GET(_: NextRequest) {
  try {
    const session = await auth()

    /* ---- Auth Guard ---- */
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [user] = await db
      .select()
      .from(UsersTable)
      .where(eq(UsersTable.id, session.user.id))
      .limit(1)

    if (!user || !["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      )
    }

    /* ---- Fetch Categories ---- */
    const allCategories: CategoryRow[] = await db
      .select({
        id: CategoriesTable.id,
        name: CategoriesTable.name,
        slug: CategoriesTable.slug,
        parentId: CategoriesTable.parentId,
        sortOrder: CategoriesTable.sortOrder,
        isActive: CategoriesTable.isActive,
      })
      .from(CategoriesTable)
      .where(eq(CategoriesTable.isActive, true))
      .orderBy(CategoriesTable.sortOrder)

    /* ---- Build Tree ---- */
  const buildTree = (parentId: string | null): CategoryTreeNode[] => {
  return allCategories
    .filter(category => category.parentId === parentId)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map(category => ({
      ...category,
      sortOrder: category.sortOrder ?? 0, // ✅ normalize null → 0
      children: buildTree(category.id),
    }))
}


    const tree = buildTree(null)

    /* ---- Flat List (for dropdowns) ---- */
    const flatList = allCategories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      parentId: category.parentId,
    }))

    return NextResponse.json({
      success: true,
      data: {
        tree,
        flatList,
      },
    })
  } catch (error) {
    console.error("Categories tree API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
