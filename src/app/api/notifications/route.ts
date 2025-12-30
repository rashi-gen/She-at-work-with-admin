/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/db'
import { NotificationsTable, UsersTable } from '@/db/schema'
import { and, eq, desc, sql } from 'drizzle-orm'

// Define notification type enum based on your schema
type NotificationType = 
  | 'CONTENT_PUBLISHED'
  | 'EVENT_REMINDER'
  | 'EVENT_REGISTRATION'
  | 'COMMENT_REPLY'
  | 'CONTENT_APPROVED'
  | 'CONTENT_REJECTED'
  | 'ROLE_CHANGED'
  | 'SYSTEM'

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
    const readParam = searchParams.get('read')
    const type = searchParams.get('type')
    
    const conditions = [eq(NotificationsTable.userId, user.id)]
    
    // Filter by read status
    if (readParam !== undefined && readParam !== null) {
      conditions.push(eq(NotificationsTable.isRead, readParam === 'true'))
    }
    
    // Filter by type - validate enum value
    if (type) {
      const validNotificationTypes: NotificationType[] = [
        'CONTENT_PUBLISHED',
        'EVENT_REMINDER',
        'EVENT_REGISTRATION',
        'COMMENT_REPLY',
        'CONTENT_APPROVED',
        'CONTENT_REJECTED',
        'ROLE_CHANGED',
        'SYSTEM'
      ]
      
      if (validNotificationTypes.includes(type as NotificationType)) {
        conditions.push(eq(NotificationsTable.type, type as NotificationType))
      }
    }
    
    const whereCondition = conditions.length > 0 
      ? and(...conditions)
      : undefined
    
    // Get total count
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(NotificationsTable)
      .where(whereCondition)
    
    // Get unread count
    const [{ unreadCount }] = await db
      .select({ 
        unreadCount: sql<number>`count(case when ${NotificationsTable.isRead} = false then 1 end)` 
      })
      .from(NotificationsTable)
      .where(eq(NotificationsTable.userId, user.id))
    
    // Get notifications - removed updatedAt as it doesn't exist
    const notifications = await db
      .select({
        id: NotificationsTable.id,
        title: NotificationsTable.title,
        message: NotificationsTable.message,
        type: NotificationsTable.type,
        isRead: NotificationsTable.isRead,
        readAt: NotificationsTable.readAt,
        metadata: NotificationsTable.metadata,
        createdAt: NotificationsTable.createdAt
      })
      .from(NotificationsTable)
      .where(whereCondition)
      .orderBy(desc(NotificationsTable.createdAt))
      .limit(limit)
      .offset(offset)
    
    const total = Number(count)
    const totalPages = Math.ceil(total / limit)
    
    return NextResponse.json({
      success: true,
      data: notifications,
      unreadCount: Number(unreadCount),
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
    console.error('Notifications GET API Error:', error)
    
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

export async function PATCH(req: NextRequest) {
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
    
    const searchParams = req.nextUrl.searchParams
    
    // Mark all as read
    const readAll = searchParams.get('readAll')
    if (readAll === 'true') {
      await db
        .update(NotificationsTable)
        .set({
          isRead: true,
          readAt: new Date()
        })
        .where(
          and(
            eq(NotificationsTable.userId, user.id),
            eq(NotificationsTable.isRead, false)
          )
        )
      
      return NextResponse.json({
        success: true,
        data: { message: 'All notifications marked as read' }
      })
    }
    
    // Mark single notification as read
    const notificationId = searchParams.get('id')
    const markRead = searchParams.get('read')
    
    if (notificationId && markRead === 'true') {
      const [notification] = await db
        .select()
        .from(NotificationsTable)
        .where(
          and(
            eq(NotificationsTable.id, notificationId),
            eq(NotificationsTable.userId, user.id)
          )
        )
        .limit(1)
      
      if (!notification) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'NOT_FOUND',
              message: 'Notification not found'
            }
          },
          { status: 404 }
        )
      }
      
      await db
        .update(NotificationsTable)
        .set({
          isRead: true,
          readAt: new Date()
        })
        .where(
          and(
            eq(NotificationsTable.id, notificationId),
            eq(NotificationsTable.userId, user.id)
          )
        )
      
      return NextResponse.json({
        success: true,
        data: { message: 'Notification marked as read' }
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
    console.error('Notifications PATCH API Error:', error)
    
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