/* eslint-disable @typescript-eslint/no-explicit-any */
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
import {
  and,
  desc,
  eq,
  gte,
  like,
  lte,
  or,
  sql
} from 'drizzle-orm'

// Define enum types based on your schema
type ContentType = 'NEWS' | 'BLOG' | 'ENTRECHAT' | 'SUCCESS_STORY' | 'RESOURCE'
type ContentStatus = 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'ARCHIVED' | 'REJECTED'
type ContentLanguage = 'ENGLISH' | 'HINDI'

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

    // Parse query parameters
    const searchParams = req.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100)
    const offset = (page - 1) * limit
    
    // Get filter parameters
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const featured = searchParams.get('featured')
    const trending = searchParams.get('trending')
    const search = searchParams.get('search')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const category = searchParams.get('category')
    const author = searchParams.get('author')
    const language = searchParams.get('language')
    const deleted = searchParams.get('deleted')
    const myContent = searchParams.get('myContent')
    
    // Build query conditions
    const conditions = []
    
    // Status filter based on role
    if (user.role === 'USER') {
      conditions.push(eq(ContentTable.status, 'PUBLISHED' as ContentStatus))
    } else if (user.role === 'AUTHOR') {
      if (myContent) {
        const [authorRecord] = await db
          .select({ id: AuthorsTable.id })
          .from(AuthorsTable)
          .where(eq(AuthorsTable.userId, user.id))
          .limit(1)
          
        if (authorRecord) {
          conditions.push(eq(ContentTable.authorId, authorRecord.id))
        }
      } else {
        conditions.push(
          or(
            eq(ContentTable.status, 'PUBLISHED' as ContentStatus),
            eq(ContentTable.status, 'PENDING' as ContentStatus)
          )
        )
      }
    }
    
    // Content type filter - validate enum value
    if (type) {
      const validContentTypes: ContentType[] = ['NEWS', 'BLOG', 'ENTRECHAT', 'SUCCESS_STORY', 'RESOURCE']
      if (validContentTypes.includes(type as ContentType)) {
        conditions.push(eq(ContentTable.contentType, type as ContentType))
      }
    }
    
    // Status filter - validate enum value
    if (status) {
      const validStatuses: ContentStatus[] = ['DRAFT', 'PENDING', 'PUBLISHED', 'ARCHIVED', 'REJECTED']
      if (validStatuses.includes(status as ContentStatus)) {
        conditions.push(eq(ContentTable.status, status as ContentStatus))
      }
    }
    
    // Featured filter
    if (featured !== undefined && featured !== null) {
      conditions.push(eq(ContentTable.isFeatured, featured === 'true'))
    }
    
    // Trending filter
    if (trending !== undefined && trending !== null) {
      conditions.push(eq(ContentTable.isTrending, trending === 'true'))
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
    
    // Date range
    if (dateFrom) {
      const fromDate = new Date(dateFrom)
      conditions.push(gte(ContentTable.publishedAt || ContentTable.createdAt, fromDate))
    }
    if (dateTo) {
      const toDate = new Date(dateTo)
      conditions.push(lte(ContentTable.publishedAt || ContentTable.createdAt, toDate))
    }
    
    // Category filter
    if (category) {
      conditions.push(eq(ContentTable.categoryId, category))
    }
    
    // Author filter
    if (author) {
      conditions.push(eq(ContentTable.authorId, author))
    }
    
    // Language filter - validate enum value
    if (language) {
      const validLanguages: ContentLanguage[] = ['ENGLISH', 'HINDI']
      if (validLanguages.includes(language as ContentLanguage)) {
        conditions.push(eq(ContentTable.language, language as ContentLanguage))
      }
    }
    
    // Deleted content (admin only)
    if (deleted === 'true') {
      if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'FORBIDDEN',
              message: 'Only admins can view deleted content'
            }
          },
          { status: 403 }
        )
      }
      conditions.push(sql`${ContentTable.deletedAt} IS NOT NULL`)
    } else {
      conditions.push(sql`${ContentTable.deletedAt} IS NULL`)
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
        isFeatured: ContentTable.isFeatured,
        isTrending: ContentTable.isTrending,
        publishedAt: ContentTable.publishedAt,
        createdAt: ContentTable.createdAt,
        author: {
          id: AuthorsTable.id,
          name: AuthorsTable.name,
          slug: AuthorsTable.slug,
          avatar: AuthorsTable.avatar
        },
        category: {
          id: CategoriesTable.id,
          name: CategoriesTable.name,
          slug: CategoriesTable.slug
        }
      })
      .from(ContentTable)
      .leftJoin(AuthorsTable, eq(ContentTable.authorId, AuthorsTable.id))
      .leftJoin(CategoriesTable, eq(ContentTable.categoryId, CategoriesTable.id))
      .where(whereCondition)
      .orderBy(desc(ContentTable.publishedAt || ContentTable.createdAt))
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
      },
      meta: {
        filters: {
          type,
          status,
          featured,
          trending,
          search,
          dateFrom,
          dateTo,
          category,
          author,
          language,
          deleted,
          myContent
        }
      }
    })
    
  } catch (error: any) {
    console.error('Content GET API Error:', error)
    
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

export async function POST(req: NextRequest) {
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
            message: 'Only authors and above can create content'
          }
        },
        { status: 403 }
      )
    }
    
    const body = await req.json()
    
    // Validate required fields
    if (!body.title || !body.content) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Title and content are required'
          }
        },
        { status: 400 }
      )
    }
    
    // Find author profile
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
    
    // Validate contentType enum
    const validContentTypes: ContentType[] = ['NEWS', 'BLOG', 'ENTRECHAT', 'SUCCESS_STORY', 'RESOURCE']
    const contentType: ContentType = validContentTypes.includes(body.contentType as ContentType) 
      ? body.contentType as ContentType 
      : 'BLOG'
    
    // Validate status enum
    const validStatuses: ContentStatus[] = ['DRAFT', 'PENDING', 'PUBLISHED', 'ARCHIVED', 'REJECTED']
    const status: ContentStatus = validStatuses.includes(body.status as ContentStatus)
      ? body.status as ContentStatus
      : 'DRAFT'
    
    // Validate language enum
    const validLanguages: ContentLanguage[] = ['ENGLISH', 'HINDI']
    const language: ContentLanguage = validLanguages.includes(body.language as ContentLanguage)
      ? body.language as ContentLanguage
      : 'ENGLISH'
    
    // Create content
    const [content] = await db
      .insert(ContentTable)
      .values({
        title: body.title,
        slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        summary: body.summary,
        content: body.content,
        contentType: contentType,
        featuredImage: body.featuredImage,
        authorId: author.id,
        categoryId: body.categoryId,
        status: status,
        createdBy: user.id,
        language: language
      })
      .returning()
    
    // Add tags if provided
    if (body.tags && Array.isArray(body.tags)) {
      const tagInserts = body.tags.map((tagId: string) => ({
        contentId: content.id,
        tagId
      }))
      
      if (tagInserts.length > 0) {
        await db
          .insert(ContentTagsTable)
          .values(tagInserts)
      }
    }
    
    return NextResponse.json({
      success: true,
      data: content
    }, { status: 201 })
    
  } catch (error: any) {
    console.error('Content POST API Error:', error)
    
    // Handle duplicate slug error
    if (error.message?.includes('unique constraint') || error.message?.includes('duplicate key')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'DUPLICATE_SLUG',
            message: 'A content item with this slug already exists'
          }
        },
        { status: 409 }
      )
    }
    
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