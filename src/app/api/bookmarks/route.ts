/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/db'
import {
  BookmarksTable,
  ContentTable
} from '@/db/schema'
import { and, desc, eq, sql } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required'
          }
        },
        { status: 401 }
      )
    }

    // Parse query parameters
    const searchParams = req.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100)
    const offset = (page - 1) * limit

    // Get total count
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(BookmarksTable)
      .where(eq(BookmarksTable.userId, session.user.id))

    // Get bookmarks with content details
    const bookmarks = await db.query.BookmarksTable.findMany({
      where: and(
        eq(BookmarksTable.userId, session.user.id),
        eq(ContentTable.status, 'PUBLISHED'),
        sql`${ContentTable.deletedAt} IS NULL`
      ),
      columns: {
        id: true,
        createdAt: true
      },
      with: {
        content: {
          columns: {
            id: true,
            title: true,
            slug: true,
            summary: true,
            contentType: true,
            featuredImage: true,
            viewCount: true,
            likeCount: true,
            publishedAt: true
          },
          with: {
            author: {
              columns: {
                id: true,
                name: true,
                avatar: true
              }
            },
            category: {
              columns: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: desc(BookmarksTable.createdAt),
      limit: limit,
      offset: offset
    })

    const total = Number(count)
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: bookmarks,
      pagination: {
        page: page,
        limit: limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })

  } catch (error: any) {
    console.error('Bookmarks API Error:', error)

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An internal error occurred',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }
      },
      { status: 500 }
    )
  }
}