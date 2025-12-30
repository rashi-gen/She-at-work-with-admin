/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/db'
import {
  CommentsTable,
  ContentTable,
  UsersTable,
} from '@/db/schema'
import { and, asc, eq, sql } from 'drizzle-orm'

/* -------------------------------------------------------------------------- */
/*                                   GET                                      */
/* -------------------------------------------------------------------------- */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: contentId } = await context.params

    if (!contentId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'BAD_REQUEST',
            message: 'Content ID is required',
          },
        },
        { status: 400 }
      )
    }

    /* --------------------------- PAGINATION -------------------------------- */
    const searchParams = req.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100)
    const offset = (page - 1) * limit
    const parentId = searchParams.get('parentId')

    /* ------------------------ CHECK CONTENT -------------------------------- */
    const [content] = await db
      .select()
      .from(ContentTable)
      .where(
        and(
          eq(ContentTable.id, contentId),
          eq(ContentTable.status, 'PUBLISHED')
        )
      )
      .limit(1)

    if (!content) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Content not found or not published',
          },
        },
        { status: 404 }
      )
    }

    /* -------------------------- CURRENT USER ------------------------------- */
    const session = await auth()
    let user: any = null
    let isContentAuthor = false

    if (session?.user?.id) {
      const [userRecord] = await db
        .select()
        .from(UsersTable)
        .where(eq(UsersTable.id, session.user.id))
        .limit(1)

      if (userRecord) {
        user = userRecord
        isContentAuthor = content.authorId === user.id
      }
    }

    /* ----------------------------- FILTERS --------------------------------- */
    const conditions: any[] = [
      eq(CommentsTable.contentId, contentId),
    ]

    if (parentId) {
      conditions.push(eq(CommentsTable.parentId, parentId))
    } else {
      conditions.push(sql`${CommentsTable.parentId} IS NULL`)
    }

    if (!user || (user.role === 'USER' && !isContentAuthor)) {
      conditions.push(eq(CommentsTable.isApproved, true))
      conditions.push(eq(CommentsTable.isSpam, false))
    }

    const whereCondition = and(...conditions)

    /* ------------------------------ COUNT ---------------------------------- */
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(CommentsTable)
      .where(whereCondition)

    /* ------------------------------ DATA ----------------------------------- */
    const comments = await db
      .select({
        id: CommentsTable.id,
        content: CommentsTable.content,
        authorName: CommentsTable.authorName,
        authorEmail: CommentsTable.authorEmail,
        isApproved: CommentsTable.isApproved,
        isSpam: CommentsTable.isSpam,
        parentId: CommentsTable.parentId,
        createdAt: CommentsTable.createdAt,
        user: {
          id: UsersTable.id,
          name: UsersTable.name,
          image: UsersTable.image,
        },
      })
      .from(CommentsTable)
      .leftJoin(
        UsersTable,
        eq(CommentsTable.userId, UsersTable.id)
      )
      .where(whereCondition)
      .orderBy(asc(CommentsTable.createdAt))
      .limit(limit)
      .offset(offset)

    const total = Number(count)
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: comments,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error('Comments GET error:', error)

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An internal error occurred',
        },
      },
      { status: 500 }
    )
  }
}

/* -------------------------------------------------------------------------- */
/*                                   POST                                     */
/* -------------------------------------------------------------------------- */
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: contentId } = await context.params

    if (!contentId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'BAD_REQUEST',
            message: 'Content ID is required',
          },
        },
        { status: 400 }
      )
    }

    const session = await auth()
    let user: any = null

    if (session?.user?.id) {
      const [userRecord] = await db
        .select()
        .from(UsersTable)
        .where(eq(UsersTable.id, session.user.id))
        .limit(1)

      if (userRecord) user = userRecord
    }

    const [content] = await db
      .select()
      .from(ContentTable)
      .where(
        and(
          eq(ContentTable.id, contentId),
          eq(ContentTable.status, 'PUBLISHED')
        )
      )
      .limit(1)

    if (!content) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Content not found or not published',
          },
        },
        { status: 404 }
      )
    }

    const body = await req.json()

    if (!body.content) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Comment content is required',
          },
        },
        { status: 400 }
      )
    }

    if (!user && (!body.authorName || !body.authorEmail)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Name and email are required',
          },
        },
        { status: 400 }
      )
    }

    const [comment] = await db
      .insert(CommentsTable)
      .values({
        contentId,
        userId: user?.id || null,
        authorName: user?.name || body.authorName,
        authorEmail: user?.email || body.authorEmail,
        content: body.content,
        parentId: body.parentId || null,
        isApproved: !!user,
        isSpam: false,
      })
      .returning()

    await db
      .update(ContentTable)
      .set({
        commentCount: sql`${ContentTable.commentCount} + 1`,
      })
      .where(eq(ContentTable.id, contentId))

    return NextResponse.json(
      { success: true, data: comment },
      { status: 201 }
    )
  } catch (error) {
    console.error('Comments POST error:', error)

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An internal error occurred',
        },
      },
      { status: 500 }
    )
  }
}
