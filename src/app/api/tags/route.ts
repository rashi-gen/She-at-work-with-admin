// src/app/api/tags/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/db'
import { TagsTable, UsersTable } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

/* ----------------------------- GET TAGS ----------------------------- */
export async function GET(req: NextRequest) {
  try {
    const tags = await db
      .select()
      .from(TagsTable)
      .orderBy(desc(TagsTable.usageCount))

    return NextResponse.json({
      success: true,
      data: tags
    })
  } catch (error) {
    console.error('Tags API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/* ----------------------------- CREATE TAG ----------------------------- */
export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    /* ------------------ USER ------------------ */
    const users = await db
      .select()
      .from(UsersTable)
      .where(eq(UsersTable.id, session.user.id))
      .limit(1)

    const user = users[0]

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (!['AUTHOR', 'ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    /* ------------------ BODY ------------------ */
    const body = await req.json()

    if (!body.name || typeof body.name !== 'string') {
      return NextResponse.json(
        { error: 'Tag name is required' },
        { status: 400 }
      )
    }

    const slug =
      body.slug ??
      body.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')

    /* ------------------ INSERT ------------------ */
    const inserted = await db
      .insert(TagsTable)
      .values({
        name: body.name,
        slug,
        description: body.description ?? null,
        color: body.color ?? null,
        createdBy: user.id
      })
      .returning()

    return NextResponse.json(
      {
        success: true,
        data: inserted[0]
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create tag API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
