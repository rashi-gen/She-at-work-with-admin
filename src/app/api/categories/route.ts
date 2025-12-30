// src/app/api/categories/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/db'
import { CategoriesTable, UsersTable } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  try {
    const categories = await db
      .select()
      .from(CategoriesTable)
      .where(eq(CategoriesTable.isActive, true))
      .orderBy(CategoriesTable.sortOrder)

    return NextResponse.json({
      success: true,
      data: categories
    })

  } catch (error) {
    console.error('Categories API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}