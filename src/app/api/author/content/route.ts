// src/app/api/author/content/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/db'
import {
  AuthorsTable,
  CategoriesTable,
  ContentTable,
  ContentTagsTable,
  TagsTable,
  UsersTable
} from '@/db/schema'
import { and, eq, desc, like, or, sql } from 'drizzle-orm'
const CONTENT_STATUSES = [
  'DRAFT',
  'PENDING',
  'PUBLISHED',
  'ARCHIVED',
  'REJECTED'
] as const

const CONTENT_TYPES = [
  'NEWS',
  'BLOG',
  'ENTRECHAT',
  'SUCCESS_STORY',
  'RESOURCE'
] as const


export async function GET(req: NextRequest) {
  try {
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

    // Get user from database
    const [user] = await db
      .select()
      .from(UsersTable)
      .where(eq(UsersTable.id, session.user.id))
      .limit(1)
      
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'User not found'
          }
        },
        { status: 401 }
      )
    }

    // Check if user is AUTHOR or higher
    if (user.role !== 'AUTHOR' && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Only authors and above can access this endpoint'
          }
        },
        { status: 403 }
      )
    }

    // Parse query parameters
    const searchParams = req.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100)
    const offset = (page - 1) * limit
    
    // Get filter parameters
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const search = searchParams.get('search')
    
    // Get author profile
    const [author] = await db
      .select()
      .from(AuthorsTable)
      .where(eq(AuthorsTable.userId, user.id))
      .limit(1)
    
    if (!author) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Author profile not found'
          }
        },
        { status: 404 }
      )
    }
    
    // Build query conditions
    const conditions: any[] = [
      eq(ContentTable.authorId, author.id),
      sql`${ContentTable.deletedAt} IS NULL`
    ]
    const isContentStatus = (
  value: string
): value is (typeof CONTENT_STATUSES)[number] =>
  CONTENT_STATUSES.includes(value as any)

const isContentType = (
  value: string
): value is (typeof CONTENT_TYPES)[number] =>
  CONTENT_TYPES.includes(value as any)

    // Status filter
  // Status filter
if (status && status !== 'ALL' && isContentStatus(status)) {
  conditions.push(eq(ContentTable.status, status))
}

// Type filter
if (type && type !== 'ALL' && isContentType(type)) {
  conditions.push(eq(ContentTable.contentType, type))
}

    
    // Search filter
    if (search) {
      conditions.push(
        or(
          like(ContentTable.title, `%${search}%`),
          like(ContentTable.summary, `%${search}%`)
        )
      )
    }
    
    // Build final where condition
    const whereCondition = conditions.length > 0 
      ? and(...conditions)
      : undefined
    
    // Get total count
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(ContentTable)
      .where(whereCondition)
    
    // Get paginated data with joins
    const content = await db
      .select({
        id: ContentTable.id,
        title: ContentTable.title,
        slug: ContentTable.slug,
        summary: ContentTable.summary,
        contentType: ContentTable.contentType,
        status: ContentTable.status,
        featuredImage: ContentTable.featuredImage,
        viewCount: ContentTable.viewCount,
        likeCount: ContentTable.likeCount,
        commentCount: ContentTable.commentCount,
        publishedAt: ContentTable.publishedAt,
        createdAt: ContentTable.createdAt,
        category: {
          id: CategoriesTable.id,
          name: CategoriesTable.name,
          slug: CategoriesTable.slug
        }
      })
      .from(ContentTable)
      .leftJoin(CategoriesTable, eq(ContentTable.categoryId, CategoriesTable.id))
      .where(whereCondition)
      .orderBy(desc(ContentTable.createdAt))
      .limit(limit)
      .offset(offset)
    
    // Get tags for each content
    const contentWithTags = await Promise.all(
      content.map(async (item) => {
        const tags = await db
          .select({
            id: TagsTable.id,
            name: TagsTable.name,
            slug: TagsTable.slug
          })
          .from(ContentTagsTable)
          .innerJoin(TagsTable, eq(ContentTagsTable.tagId, TagsTable.id))
          .where(eq(ContentTagsTable.contentId, item.id))
        
        return {
          ...item,
          tags
        }
      })
    )
    
    const total = Number(count)
    const totalPages = Math.ceil(total / limit)
    
    return NextResponse.json({
      success: true,
      data: contentWithTags,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })
    
  } catch (error: any) {
    console.error('Author content API Error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An internal error occurred'
        }
      },
      { status: 500 }
    )
  }
}