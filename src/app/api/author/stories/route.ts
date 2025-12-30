// src/app/api/author/stories/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/db'
import {
  StorySubmissionsTable,
  UsersTable,
  ContentStatus
} from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

/* ============================ GET STORIES ============================ */
export async function GET(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    /* -------- USER -------- */
    const [user] = await db
      .select()
      .from(UsersTable)
      .where(eq(UsersTable.id, session.user.id))
      .limit(1)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!['AUTHOR', 'ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    /* -------- STORIES -------- */
    const stories = await db
      .select()
      .from(StorySubmissionsTable)
      .where(eq(StorySubmissionsTable.userId, user.id))
      .orderBy(desc(StorySubmissionsTable.submittedAt))

    return NextResponse.json({
      success: true,
      data: stories
    })
  } catch (error) {
    console.error('Author stories API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/* ============================ CREATE STORY ============================ */
export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    /* -------- USER -------- */
    const [user] = await db
      .select()
      .from(UsersTable)
      .where(eq(UsersTable.id, session.user.id))
      .limit(1)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!['AUTHOR', 'ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    /* -------- BODY -------- */
    const body = await req.json()

    if (!body.title || !body.story) {
      return NextResponse.json(
        { error: 'Title and story are required' },
        { status: 400 }
      )
    }

    /* -------- INSERT -------- */
 const inserted = await db
  .insert(StorySubmissionsTable)
  .values({
    userId: user.id,
    name: user.name ?? '',
    email: user.email,
    title: body.title,
    story: body.story,
    businessName: body.businessName ?? null,
    industry: body.industry ?? null,
    images: body.images ?? [],
    status: 'PENDING' // ✅ correct for Drizzle pgEnum
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
    console.error('Create story API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
