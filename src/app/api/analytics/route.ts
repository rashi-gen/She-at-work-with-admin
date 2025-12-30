/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/db'
import {
  AuthorsTable,
  ContentLikesTable,
  ContentTable,
  ContentViewsTable,
  EventsTable,
  UsersTable
} from '@/db/schema'
import { and, desc, eq, gte, sql } from 'drizzle-orm'

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

    // Parse query parameters
    const searchParams = req.nextUrl.searchParams
    const scope = searchParams.get('scope') || (user.role === 'USER' ? 'my' : 'all')
    const entity = searchParams.get('entity') || 'overview'
    const period = searchParams.get('period') || '30d'
    
    // Calculate date range based on period
    const now = new Date()
    const dateFrom = new Date(now)
    
    switch (period) {
      case '7d':
        dateFrom.setDate(dateFrom.getDate() - 7)
        break
      case '30d':
        dateFrom.setDate(dateFrom.getDate() - 30)
        break
      case '90d':
        dateFrom.setDate(dateFrom.getDate() - 90)
        break
      case 'all':
        dateFrom.setFullYear(2000) // Very old date
        break
      default:
        dateFrom.setDate(dateFrom.getDate() - 30)
    }
    
    const analytics: any = {}
    
    if (entity === 'overview' || entity === 'content') {
      // Content analytics
      const contentConditions = [eq(ContentTable.status, 'PUBLISHED')]
      
      if (scope === 'my' && user.role === 'AUTHOR') {
        const [author] = await db
          .select({ id: AuthorsTable.id })
          .from(AuthorsTable)
          .where(eq(AuthorsTable.userId, user.id))
          .limit(1)
        
        if (author) {
          contentConditions.push(eq(ContentTable.authorId, author.id))
        }
      }
      
      const contentWhere = and(...contentConditions)
      
      // Total content
      const [contentStats] = await db
        .select({
          total: sql<number>`count(*)`,
          totalViews: sql<number>`coalesce(sum(${ContentTable.viewCount}), 0)`,
          totalLikes: sql<number>`coalesce(sum(${ContentTable.likeCount}), 0)`,
          totalComments: sql<number>`coalesce(sum(${ContentTable.commentCount}), 0)`,
          totalShares: sql<number>`coalesce(sum(${ContentTable.shareCount}), 0)`
        })
        .from(ContentTable)
        .where(contentWhere)
      
      // Recent content (last period)
      const [recentContentStats] = await db
        .select({
          recentCount: sql<number>`count(*)`,
          recentViews: sql<number>`coalesce(sum(${ContentTable.viewCount}), 0)`
        })
        .from(ContentTable)
        .where(
          and(
            contentWhere,
            gte(ContentTable.publishedAt || ContentTable.createdAt, dateFrom)
          )
        )
      
      // Content by type
      const contentByType = await db
        .select({
          type: ContentTable.contentType,
          count: sql<number>`count(*)`
        })
        .from(ContentTable)
        .where(contentWhere)
        .groupBy(ContentTable.contentType)
      
      // Top performing content
      const topContent = await db
        .select({
          id: ContentTable.id,
          title: ContentTable.title,
          contentType: ContentTable.contentType,
          viewCount: ContentTable.viewCount,
          likeCount: ContentTable.likeCount,
          commentCount: ContentTable.commentCount,
          publishedAt: ContentTable.publishedAt
        })
        .from(ContentTable)
        .where(contentWhere)
        .orderBy(desc(ContentTable.viewCount))
        .limit(5)
      
      analytics.content = {
        ...contentStats,
        ...recentContentStats,
        byType: contentByType,
        topPerforming: topContent
      }
    }
    
    if (entity === 'overview' || entity === 'events') {
      // Event analytics (ADMIN+ only)
      if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
        const [eventStats] = await db
          .select({
            totalEvents: sql<number>`count(*)`,
            totalRegistrations: sql<number>`coalesce(sum(${EventsTable.registrationCount}), 0)`,
            totalAttendance: sql<number>`coalesce(sum(${EventsTable.attendanceCount}), 0)`,
            upcomingEvents: sql<number>`count(case when ${EventsTable.status} = 'UPCOMING' then 1 end)`
          })
          .from(EventsTable)
          .where(
            and(
              sql`${EventsTable.deletedAt} IS NULL`,
              gte(EventsTable.createdAt, dateFrom)
            )
          )
        
        // Events by type
        const eventsByType = await db
          .select({
            type: EventsTable.eventType,
            count: sql<number>`count(*)`
          })
          .from(EventsTable)
          .where(
            and(
              sql`${EventsTable.deletedAt} IS NULL`,
              gte(EventsTable.createdAt, dateFrom)
            )
          )
          .groupBy(EventsTable.eventType)
        
        analytics.events = {
          ...eventStats,
          byType: eventsByType
        }
      }
    }
    
    if (entity === 'overview' || entity === 'users') {
      // User analytics (ADMIN+ only)
      if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
        const [userStats] = await db
          .select({
            totalUsers: sql<number>`count(*)`,
            activeUsers: sql<number>`count(case when ${UsersTable.isActive} = true then 1 end)`,
            newUsers: sql<number>`count(case when ${UsersTable.createdAt} >= ${dateFrom} then 1 end)`,
            authors: sql<number>`count(case when ${UsersTable.role} = 'AUTHOR' then 1 end)`,
            entrepreneurs: sql<number>`count(case when ${UsersTable.isEntrepreneur} = true then 1 end)`
          })
          .from(UsersTable)
          .where(sql`${UsersTable.deletedAt} IS NULL`)
        
        // Users by role
        const usersByRole = await db
          .select({
            role: UsersTable.role,
            count: sql<number>`count(*)`
          })
          .from(UsersTable)
          .where(sql`${UsersTable.deletedAt} IS NULL`)
          .groupBy(UsersTable.role)
        
        analytics.users = {
          ...userStats,
          byRole: usersByRole
        }
      }
    }
    
    // Engagement metrics
    if (entity === 'engagement') {
      // Views over time
      const viewsOverTime = await db
        .select({
          date: sql<string>`to_char(${ContentViewsTable.viewedAt}, 'YYYY-MM-DD')`,
          count: sql<number>`count(*)`
        })
        .from(ContentViewsTable)
        .where(gte(ContentViewsTable.viewedAt, dateFrom))
        .groupBy(sql`to_char(${ContentViewsTable.viewedAt}, 'YYYY-MM-DD')`)
        .orderBy(sql`to_char(${ContentViewsTable.viewedAt}, 'YYYY-MM-DD')`)
      
      // Likes over time
      const likesOverTime = await db
        .select({
          date: sql<string>`to_char(${ContentLikesTable.createdAt}, 'YYYY-MM-DD')`,
          count: sql<number>`count(*)`
        })
        .from(ContentLikesTable)
        .where(gte(ContentLikesTable.createdAt, dateFrom))
        .groupBy(sql`to_char(${ContentLikesTable.createdAt}, 'YYYY-MM-DD')`)
        .orderBy(sql`to_char(${ContentLikesTable.createdAt}, 'YYYY-MM-DD')`)
      
      analytics.engagement = {
        viewsOverTime,
        likesOverTime
      }
    }
    
    return NextResponse.json({
      success: true,
      data: {
        scope,
        entity,
        period,
        dateFrom,
        dateTo: now,
        ...analytics
      }
    })
    
  } catch (error: any) {
    console.error('Analytics API Error:', error)
    
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