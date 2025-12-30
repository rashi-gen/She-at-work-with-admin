/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/db'
import { 
  EventsTable, 
  EventRegistrationsTable,
  UsersTable 
} from '@/db/schema'
import { and, eq, or, like, gte, lte, sql, asc } from 'drizzle-orm'

// Define enum types based on your schema
type EventType = 'WORKSHOP' | 'WEBINAR' | 'NETWORKING' | 'MASTERCLASS' | 'CONFERENCE'
type EventStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED' // Note: Removed DRAFT as it doesn't exist in your schema

export async function GET(req: NextRequest) {
  try {
    // Check authentication
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

    // Parse query parameters
    const searchParams = req.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100)
    const offset = (page - 1) * limit
    
    // Get filter parameters
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const online = searchParams.get('online')
    const free = searchParams.get('free')
    const city = searchParams.get('city')
    const search = searchParams.get('search')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const myEvents = searchParams.get('myEvents')
    const featured = searchParams.get('featured')
    const deleted = searchParams.get('deleted')
    
    const conditions = []
    
    // Filter by type - validate enum value
    if (type) {
      const validEventTypes: EventType[] = ['WORKSHOP', 'WEBINAR', 'NETWORKING', 'MASTERCLASS', 'CONFERENCE']
      if (validEventTypes.includes(type as EventType)) {
        conditions.push(eq(EventsTable.eventType, type as EventType))
      }
    }
    
    // Filter by status - validate enum value
    if (status) {
      const validStatuses: EventStatus[] = ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED']
      if (validStatuses.includes(status as EventStatus)) {
        conditions.push(eq(EventsTable.status, status as EventStatus))
      }
    } else {
      // Default to upcoming for public
      if (!user || user.role === 'USER') {
        conditions.push(eq(EventsTable.status, 'UPCOMING' as EventStatus))
      }
    }
    
    // Filter by online/offline
    if (online !== undefined && online !== null) {
      conditions.push(eq(EventsTable.isOnline, online === 'true'))
    }
    
    // Filter by free/paid
    if (free !== undefined && free !== null) {
      conditions.push(eq(EventsTable.isFree, free === 'true'))
    }
    
    // Filter by city
    if (city) {
      conditions.push(eq(EventsTable.city, city))
    }
    
    // Search filter
    if (search) {
      conditions.push(
        or(
          like(EventsTable.title, `%${search}%`),
          like(EventsTable.description, `%${search}%`)
        )
      )
    }
    
    // Date range
    if (dateFrom) {
      const fromDate = new Date(dateFrom)
      conditions.push(gte(EventsTable.startDate, fromDate))
    }
    if (dateTo) {
      const toDate = new Date(dateTo)
      conditions.push(lte(EventsTable.startDate, toDate))
    }
    
    // My events (created by user)
    if (myEvents === 'true' && user) {
      conditions.push(eq(EventsTable.createdBy, user.id))
    }
    
    // Featured filter
    if (featured !== undefined && featured !== null) {
      conditions.push(eq(EventsTable.isFeatured, featured === 'true'))
    }
    
    // Deleted filter
    if (deleted === 'true') {
      if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'FORBIDDEN',
              message: 'Only admins can view deleted events'
            }
          },
          { status: 403 }
        )
      }
      conditions.push(sql`${EventsTable.deletedAt} IS NOT NULL`)
    } else {
      conditions.push(sql`${EventsTable.deletedAt} IS NULL`)
    }
    
    const whereCondition = conditions.length > 0 
      ? and(...conditions)
      : undefined
    
    // Get total count
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(EventsTable)
      .where(whereCondition)
    
    // Get events with host info
    const events = await db
      .select({
        id: EventsTable.id,
        title: EventsTable.title,
        slug: EventsTable.slug,
        description: EventsTable.description,
        eventType: EventsTable.eventType,
        status: EventsTable.status,
        coverImage: EventsTable.coverImage,
        startDate: EventsTable.startDate,
        endDate: EventsTable.endDate,
        isOnline: EventsTable.isOnline,
        venue: EventsTable.venue,
        city: EventsTable.city,
        isFree: EventsTable.isFree,
        price: EventsTable.price,
        registrationCount: EventsTable.registrationCount,
        attendanceCount: EventsTable.attendanceCount,
        isFeatured: EventsTable.isFeatured,
        registrationDeadline: EventsTable.registrationDeadline,
        createdAt: EventsTable.createdAt,
        host: {
          id: UsersTable.id,
          name: UsersTable.name,
          email: UsersTable.email
        }
      })
      .from(EventsTable)
      .leftJoin(UsersTable, eq(EventsTable.hostId, UsersTable.id))
      .where(whereCondition)
      .orderBy(asc(EventsTable.startDate))
      .limit(limit)
      .offset(offset)
    
    // Check user registration status
    const eventsWithRegistration = await Promise.all(
      events.map(async (event) => {
        let isRegistered = false
        
        if (user) {
          const [registration] = await db
            .select()
            .from(EventRegistrationsTable)
            .where(
              and(
                eq(EventRegistrationsTable.eventId, event.id),
                eq(EventRegistrationsTable.userId, user.id)
              )
            )
            .limit(1)
          
          isRegistered = !!registration
        }
        
        return {
          ...event,
          isRegistered
        }
      })
    )
    
    const total = Number(count)
    const totalPages = Math.ceil(total / limit)
    
    return NextResponse.json({
      success: true,
      data: eventsWithRegistration,
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
    console.error('Events GET API Error:', error)
    
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
    
    // Only ADMIN+ can create events
    if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Only admins can create events'
          }
        },
        { status: 403 }
      )
    }
    
    const body = await req.json()
    
    // Validate required fields
    if (!body.title || !body.description || !body.startDate || !body.endDate) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Title, description, start date, and end date are required'
          }
        },
        { status: 400 }
      )
    }
    
    // Validate dates
    const startDate = new Date(body.startDate)
    const endDate = new Date(body.endDate)
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid date format'
          }
        },
        { status: 400 }
      )
    }
    
    if (endDate <= startDate) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'End date must be after start date'
          }
        },
        { status: 400 }
      )
    }
    
    // Validate registration deadline if provided
    let registrationDeadline = null
    if (body.registrationDeadline) {
      registrationDeadline = new Date(body.registrationDeadline)
      if (isNaN(registrationDeadline.getTime())) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Invalid registration deadline format'
            }
          },
          { status: 400 }
        )
      }
    }
    
    // Validate eventType enum
    const validEventTypes: EventType[] = ['WORKSHOP', 'WEBINAR', 'NETWORKING', 'MASTERCLASS', 'CONFERENCE']
    const eventType: EventType = validEventTypes.includes(body.eventType as EventType) 
      ? body.eventType as EventType 
      : 'WEBINAR'
    
    // Validate status enum
    const validStatuses: EventStatus[] = ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED']
    const status: EventStatus = validStatuses.includes(body.status as EventStatus)
      ? body.status as EventStatus
      : 'UPCOMING'
    
    const [event] = await db
      .insert(EventsTable)
      .values({
        title: body.title,
        slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: body.description,
        eventType: eventType,
        coverImage: body.coverImage,
        startDate: startDate,
        endDate: endDate,
        isOnline: body.isOnline ?? true,
        venue: body.venue,
        venueAddress: body.venueAddress,
        city: body.city,
        meetingLink: body.meetingLink,
        hostId: body.hostId || user.id,
        registrationRequired: body.registrationRequired ?? true,
        maxAttendees: body.maxAttendees,
        registrationDeadline: registrationDeadline,
        isFree: body.isFree ?? true,
        price: body.price || 0,
        agenda: body.agenda,
        status: status,
        createdBy: user.id
      })
      .returning()
    
    return NextResponse.json({
      success: true,
      data: event
    }, { status: 201 })
    
  } catch (error: any) {
    console.error('Events POST API Error:', error)
    
    // Handle duplicate slug error
    if (error.message?.includes('unique constraint') || error.message?.includes('duplicate key')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'DUPLICATE_SLUG',
            message: 'An event with this slug already exists'
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