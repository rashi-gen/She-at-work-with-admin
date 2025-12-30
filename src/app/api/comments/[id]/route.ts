/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/db'
import { CommentsTable, ContentTable, UsersTable } from '@/db/schema'
import { eq, sql } from 'drizzle-orm'

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

    const commentId = params.id
    const searchParams = req.nextUrl.searchParams
    
    // Get user from database to check role
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
    
    // Check if user is ADMIN+ for moderation
    if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
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
    
    const updates: any = {}
    
    // Approve/reject comment
    const approved = searchParams.get('approved')
    if (approved !== null) {
      updates.isApproved = approved === 'true'
    }
    
    // Mark as spam/not spam
    const spam = searchParams.get('spam')
    if (spam !== null) {
      updates.isSpam = spam === 'true'
    }
    
    // Delete comment
    const deleted = searchParams.get('deleted')
    if (deleted === 'true') {
      // Get comment to update content count
      const [comment] = await db
        .select()
        .from(CommentsTable)
        .where(eq(CommentsTable.id, commentId))
        .limit(1)
      
      if (comment) {
        // Delete comment
        await db
          .delete(CommentsTable)
          .where(eq(CommentsTable.id, commentId))
        
        // Update comment count on content
        await db
          .update(ContentTable)
          .set({
            commentCount: sql`GREATEST(${ContentTable.commentCount} - 1, 0)`
          })
          .where(eq(ContentTable.id, comment.contentId))
        
        return NextResponse.json({
          success: true,
          data: { message: 'Comment deleted successfully' }
        })
      }
      
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Comment not found'
          }
        },
        { status: 404 }
      )
    }
    
    if (Object.keys(updates).length > 0) {
      updates.updatedAt = new Date()
      
      const [updated] = await db
        .update(CommentsTable)
        .set(updates)
        .where(eq(CommentsTable.id, commentId))
        .returning()
      
      return NextResponse.json({
        success: true,
        data: updated
      })
    }
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'BAD_REQUEST',
          message: 'No valid action specified'
        }
      },
      { status: 400 }
    )

  } catch (error: any) {
    console.error('Comments PATCH API Error:', error)

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