/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/db'
import { 
  ContentTable, 
  ContentTagsTable, 
  TagsTable,
  CategoriesTable,
  AuthorsTable,
  ContentLikesTable,
  BookmarksTable,
  ContentViewsTable,
  ContentSharesTable,
  UsersTable 
} from '@/db/schema'
import { and, eq, sql } from 'drizzle-orm'

// Define enum types
type ContentStatus = 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'ARCHIVED' | 'REJECTED'

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const contentId = params.id
    
    if (!contentId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'BAD_REQUEST',
            message: 'Content ID is required'
          }
        },
        { status: 400 }
      )
    }
    
    // Get current user
    const session = await auth()
    let user = null
    
    if (session?.user?.id) {
      const [userRecord] = await db
        .select()
        .from(UsersTable)
        .where(eq(UsersTable.id, session.user.id))
        .limit(1)
      
      if (userRecord) {
        user = userRecord
      }
    }
    
    // Get content with details
    const [content] = await db
      .select({
        id: ContentTable.id,
        title: ContentTable.title,
        slug: ContentTable.slug,
        summary: ContentTable.summary,
        content: ContentTable.content,
        contentType: ContentTable.contentType,
        status: ContentTable.status,
        featuredImage: ContentTable.featuredImage,
        featuredImageAlt: ContentTable.featuredImageAlt,
        imageGallery: ContentTable.imageGallery,
        videoUrl: ContentTable.videoUrl,
        viewCount: ContentTable.viewCount,
        likeCount: ContentTable.likeCount,
        shareCount: ContentTable.shareCount,
        commentCount: ContentTable.commentCount,
        bookmarkCount: ContentTable.bookmarkCount,
        isFeatured: ContentTable.isFeatured,
        isTrending: ContentTable.isTrending,
        readingTime: ContentTable.readingTime,
        publishedAt: ContentTable.publishedAt,
        createdAt: ContentTable.createdAt,
        updatedAt: ContentTable.updatedAt,
        author: {
          id: AuthorsTable.id,
          name: AuthorsTable.name,
          slug: AuthorsTable.slug,
          avatar: AuthorsTable.avatar,
          bio: AuthorsTable.bio,
          isVerified: AuthorsTable.isVerified
        },
        category: {
          id: CategoriesTable.id,
          name: CategoriesTable.name,
          slug: CategoriesTable.slug
        },
        creator: {
          id: UsersTable.id,
          name: UsersTable.name,
          email: UsersTable.email
        }
      })
      .from(ContentTable)
      .leftJoin(AuthorsTable, eq(ContentTable.authorId, AuthorsTable.id))
      .leftJoin(CategoriesTable, eq(ContentTable.categoryId, CategoriesTable.id))
      .leftJoin(UsersTable, eq(ContentTable.createdBy, UsersTable.id))
      .where(
        and(
          eq(ContentTable.id, contentId),
          sql`${ContentTable.deletedAt} IS NULL`
        )
      )
      .limit(1)
    
    if (!content) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Content not found'
          }
        },
        { status: 404 }
      )
    }
    
    // Check if user can view this content
    if (content.status !== 'PUBLISHED') {
      if (!user) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'FORBIDDEN',
              message: 'Content not published'
            }
          },
          { status: 403 }
        )
      }
      
      if (user.role === 'USER') {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'FORBIDDEN',
              message: 'Content not published'
            }
          },
          { status: 403 }
        )
      }
      
      if (user.role === 'AUTHOR') {
        // Authors can only see their own unpublished content
        const [author] = await db
          .select()
          .from(AuthorsTable)
          .where(eq(AuthorsTable.userId, user.id))
          .limit(1)
        
        if (!author || !content.author || content.author.id !== author.id) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'FORBIDDEN',
                message: 'Content not published'
              }
            },
            { status: 403 }
          )
        }
      }
    }
    
    // Get tags
    const tags = await db
      .select({
        id: TagsTable.id,
        name: TagsTable.name,
        slug: TagsTable.slug,
        color: TagsTable.color
      })
      .from(ContentTagsTable)
      .innerJoin(TagsTable, eq(ContentTagsTable.tagId, TagsTable.id))
      .where(eq(ContentTagsTable.contentId, contentId))
    
    // Get user engagement status
    let userEngagement = null
    if (user) {
      const [like] = await db
        .select()
        .from(ContentLikesTable)
        .where(
          and(
            eq(ContentLikesTable.contentId, contentId),
            eq(ContentLikesTable.userId, user.id)
          )
        )
        .limit(1)
      
      const [bookmark] = await db
        .select()
        .from(BookmarksTable)
        .where(
          and(
            eq(BookmarksTable.contentId, contentId),
            eq(BookmarksTable.userId, user.id)
          )
        )
        .limit(1)
      
      userEngagement = {
        liked: !!like,
        bookmarked: !!bookmark
      }
    }
    
    return NextResponse.json({
      success: true,
      data: {
        ...content,
        tags,
        userEngagement
      }
    })
    
  } catch (error: any) {
    console.error('Content Detail GET API Error:', error)
    
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

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
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

    const contentId = params.id
    
    if (!contentId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'BAD_REQUEST',
            message: 'Content ID is required'
          }
        },
        { status: 400 }
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
    
    const body = await req.json()
    
    // Get existing content
    const [existing] = await db
      .select()
      .from(ContentTable)
      .where(eq(ContentTable.id, contentId))
      .limit(1)
    
    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Content not found'
          }
        },
        { status: 404 }
      )
    }
    
    // Check permissions
    if (user.role === 'AUTHOR') {
      // Authors can only edit their own content
      const [author] = await db
        .select()
        .from(AuthorsTable)
        .where(eq(AuthorsTable.userId, user.id))
        .limit(1)
      
      if (!author || existing.authorId !== author.id) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'FORBIDDEN',
              message: 'You can only edit your own content'
            }
          },
          { status: 403 }
        )
      }
      
      // Authors can't edit published content
      if (existing.status === 'PUBLISHED') {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'FORBIDDEN',
              message: 'Cannot edit published content'
            }
          },
          { status: 403 }
        )
      }
    }
    
    // Update content
    const [updated] = await db
      .update(ContentTable)
      .set({
        title: body.title || existing.title,
        slug: body.slug || existing.slug,
        summary: body.summary || existing.summary,
        content: body.content || existing.content,
        contentType: body.contentType || existing.contentType,
        featuredImage: body.featuredImage || existing.featuredImage,
        categoryId: body.categoryId || existing.categoryId,
        status: body.status || existing.status,
        updatedAt: new Date()
      })
      .where(eq(ContentTable.id, contentId))
      .returning()
    
    // Update tags if provided
    if (body.tags && Array.isArray(body.tags)) {
      // Delete existing tags
      await db
        .delete(ContentTagsTable)
        .where(eq(ContentTagsTable.contentId, contentId))
      
      // Insert new tags
      if (body.tags.length > 0) {
        await db
          .insert(ContentTagsTable)
          .values(
            body.tags.map((tagId: string) => ({
              contentId: contentId,
              tagId
            }))
          )
      }
    }
    
    return NextResponse.json({
      success: true,
      data: updated
    })
    
  } catch (error: any) {
    console.error('Content PUT API Error:', error)
    
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

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
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

    const contentId = params.id
    
    if (!contentId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'BAD_REQUEST',
            message: 'Content ID is required'
          }
        },
        { status: 400 }
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
    
    // Get existing content
    const [existing] = await db
      .select()
      .from(ContentTable)
      .where(eq(ContentTable.id, contentId))
      .limit(1)
    
    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Content not found'
          }
        },
        { status: 404 }
      )
    }
    
    // Check permissions and delete based on role
    if (user.role === 'AUTHOR') {
      // Authors can only delete their own draft content
      const [author] = await db
        .select()
        .from(AuthorsTable)
        .where(eq(AuthorsTable.userId, user.id))
        .limit(1)
      
      if (!author || existing.authorId !== author.id) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'FORBIDDEN',
              message: 'You can only delete your own content'
            }
          },
          { status: 403 }
        )
      }
      
      if (existing.status !== 'DRAFT') {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'FORBIDDEN',
              message: 'Authors can only delete draft content'
            }
          },
          { status: 403 }
        )
      }
      
      // Soft delete for authors
      await db
        .update(ContentTable)
        .set({
          deletedAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(ContentTable.id, contentId))
      
    } else if (user.role === 'ADMIN') {
      // Admins can soft delete any content
      await db
        .update(ContentTable)
        .set({
          deletedAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(ContentTable.id, contentId))
      
    } else if (user.role === 'SUPER_ADMIN') {
      // SUPER_ADMIN can hard delete
      await db
        .delete(ContentTable)
        .where(eq(ContentTable.id, contentId))
      
    } else {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Insufficient permissions'
          }
        },
        { status: 403 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: { message: 'Content deleted successfully' }
    })
    
  } catch (error: any) {
    console.error('Content DELETE API Error:', error)
    
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

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
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

    const contentId = params.id
    
    if (!contentId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'BAD_REQUEST',
            message: 'Content ID is required'
          }
        },
        { status: 400 }
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
    
    const searchParams = req.nextUrl.searchParams
    
    // Get existing content
    const [existing] = await db
      .select()
      .from(ContentTable)
      .where(eq(ContentTable.id, contentId))
      .limit(1)
    
    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Content not found'
          }
        },
        { status: 404 }
      )
    }
    
    // Handle different actions via query params
    const actions: any = {}
    const updates: any = {}
    
    // Like/Unlike
    const likeParam = searchParams.get('like')
    if (likeParam !== null) {
      const like = likeParam === 'true'
      
      if (like) {
        // Like
        await db
          .insert(ContentLikesTable)
          .values({
            contentId,
            userId: user.id
          })
          .onConflictDoNothing()
        
        await db
          .update(ContentTable)
          .set({
            likeCount: sql`${ContentTable.likeCount} + 1`
          })
          .where(eq(ContentTable.id, contentId))
        
        actions.liked = true
        
      } else {
        // Unlike
        await db
          .delete(ContentLikesTable)
          .where(
            and(
              eq(ContentLikesTable.contentId, contentId),
              eq(ContentLikesTable.userId, user.id)
            )
          )
        
        await db
          .update(ContentTable)
          .set({
            likeCount: sql`GREATEST(${ContentTable.likeCount} - 1, 0)`
          })
          .where(eq(ContentTable.id, contentId))
        
        actions.liked = false
      }
    }
    
    // Bookmark/Unbookmark
    const bookmarkParam = searchParams.get('bookmark')
    if (bookmarkParam !== null) {
      const bookmark = bookmarkParam === 'true'
      
      if (bookmark) {
        // Bookmark
        await db
          .insert(BookmarksTable)
          .values({
            contentId,
            userId: user.id
          })
          .onConflictDoNothing()
        
        await db
          .update(ContentTable)
          .set({
            bookmarkCount: sql`${ContentTable.bookmarkCount} + 1`
          })
          .where(eq(ContentTable.id, contentId))
        
        actions.bookmarked = true
        
      } else {
        // Unbookmark
        await db
          .delete(BookmarksTable)
          .where(
            and(
              eq(BookmarksTable.contentId, contentId),
              eq(BookmarksTable.userId, user.id)
            )
          )
        
        await db
          .update(ContentTable)
          .set({
            bookmarkCount: sql`GREATEST(${ContentTable.bookmarkCount} - 1, 0)`
          })
          .where(eq(ContentTable.id, contentId))
        
        actions.bookmarked = false
      }
    }
    
    // Track view
    const viewParam = searchParams.get('view')
    if (viewParam === 'true') {
      await db
        .insert(ContentViewsTable)
        .values({
          contentId,
          userId: user.id
        })
        .onConflictDoNothing()
      
      await db
        .update(ContentTable)
        .set({
          viewCount: sql`${ContentTable.viewCount} + 1`
        })
        .where(eq(ContentTable.id, contentId))
      
      actions.viewed = true
    }
    
    // Track share
    const sharePlatform = searchParams.get('share')
    if (sharePlatform) {
      await db
        .insert(ContentSharesTable)
        .values({
          contentId,
          userId: user.id,
          platform: sharePlatform
        })
      
      await db
        .update(ContentTable)
        .set({
          shareCount: sql`${ContentTable.shareCount} + 1`
        })
        .where(eq(ContentTable.id, contentId))
      
      actions.shared = sharePlatform
    }
    
    // Admin actions
    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
      // Update status
      const status = searchParams.get('status')
      if (status) {
        const validStatuses: ContentStatus[] = ['DRAFT', 'PENDING', 'PUBLISHED', 'ARCHIVED', 'REJECTED']
        if (validStatuses.includes(status as ContentStatus)) {
          updates.status = status as ContentStatus
          
          if (status === 'PUBLISHED' && !existing.publishedAt) {
            updates.publishedAt = new Date()
            updates.publishedBy = user.id
          }
        }
      }
      
      // Update featured status
      const featured = searchParams.get('featured')
      if (featured !== null) {
        updates.isFeatured = featured === 'true'
      }
      
      // Update trending status
      const trending = searchParams.get('trending')
      if (trending !== null) {
        updates.isTrending = trending === 'true'
      }
      
      // Update priority
      const priority = searchParams.get('priority')
      if (priority) {
        updates.priority = priority
      }
    }
    
    // If there are updates to content table
    if (Object.keys(updates).length > 0) {
      updates.updatedAt = new Date()
      
      await db
        .update(ContentTable)
        .set(updates)
        .where(eq(ContentTable.id, contentId))
    }
    
    return NextResponse.json({
      success: true,
      data: { 
        message: 'Content updated successfully',
        actions
      }
    })
    
  } catch (error: any) {
    console.error('Content PATCH API Error:', error)
    
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