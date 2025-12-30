/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/db'
import {
  EventRegistrationsTable,
  EventsTable,
  UsersTable
} from '@/db/schema'
import { and, eq, sql } from 'drizzle-orm'

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

    const eventId = params.id
    
    if (!eventId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'BAD_REQUEST',
            message: 'Event ID is required'
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
    
    // Get event
    const [event] = await db
      .select()
      .from(EventsTable)
      .where(eq(EventsTable.id, eventId))
      .limit(1)
    
    if (!event) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Event not found'
          }
        },
        { status: 404 }
      )
    }
    
    // User actions
    const registerParam = searchParams.get('register')
    if (registerParam !== null) {
      const register = registerParam === 'true'
      
      if (register) {
        // Check if already registered
        const [existing] = await db
          .select()
          .from(EventRegistrationsTable)
          .where(
            and(
              eq(EventRegistrationsTable.eventId, eventId),
              eq(EventRegistrationsTable.userId, user.id)
            )
          )
          .limit(1)
        
        if (existing) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'CONFLICT',
                message: 'Already registered for this event'
              }
            },
            { status: 409 }
          )
        }
        
        // Check registration deadline
        if (event.registrationDeadline && new Date() > event.registrationDeadline) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'BAD_REQUEST',
                message: 'Registration deadline has passed'
              }
            },
            { status: 400 }
          )
        }
        
        // Check max attendees
        if (event.maxAttendees && (event.registrationCount ?? 0) >= event.maxAttendees) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'BAD_REQUEST',
                message: 'Event is full'
              }
            },
            { status: 400 }
          )
        }
        
        // Check if event is cancelled
        if (event.status === 'CANCELLED') {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'BAD_REQUEST',
                message: 'Cannot register for a cancelled event'
              }
            },
            { status: 400 }
          )
        }
        
        // Check if event is completed
        if (event.status === 'COMPLETED') {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'BAD_REQUEST',
                message: 'Cannot register for a completed event'
              }
            },
            { status: 400 }
          )
        }
        
        // Register user
        await db
          .insert(EventRegistrationsTable)
          .values({
            eventId,
            userId: user.id
          })
        
        // Update registration count
        await db
          .update(EventsTable)
          .set({
            registrationCount: sql`${EventsTable.registrationCount} + 1`
          })
          .where(eq(EventsTable.id, eventId))
        
        return NextResponse.json({
          success: true,
          data: { message: 'Successfully registered for event' }
        })
        
      } else {
        // Unregister
        const [registration] = await db
          .select()
          .from(EventRegistrationsTable)
          .where(
            and(
              eq(EventRegistrationsTable.eventId, eventId),
              eq(EventRegistrationsTable.userId, user.id)
            )
          )
          .limit(1)
        
        if (!registration) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'NOT_FOUND',
                message: 'Not registered for this event'
              }
            },
            { status: 404 }
          )
        }
        
        await db
          .delete(EventRegistrationsTable)
          .where(
            and(
              eq(EventRegistrationsTable.eventId, eventId),
              eq(EventRegistrationsTable.userId, user.id)
            )
          )
        
        // Update registration count
        await db
          .update(EventsTable)
          .set({
            registrationCount: sql`GREATEST(${EventsTable.registrationCount} - 1, 0)`
          })
          .where(eq(EventsTable.id, eventId))
        
        return NextResponse.json({
          success: true,
          data: { message: 'Successfully unregistered from event' }
        })
      }
    }
    
    // Admin actions
    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
      const updates: any = {}
      
      // Cancel event
      const cancel = searchParams.get('cancel')
      if (cancel === 'true') {
        updates.status = 'CANCELLED'
      }
      
      // Complete event
      const complete = searchParams.get('complete')
      if (complete === 'true') {
        updates.status = 'COMPLETED'
      }
      
      // Feature event
      const feature = searchParams.get('feature')
      if (feature !== null) {
        updates.isFeatured = feature === 'true'
      }
      
      // Update status
      const status = searchParams.get('status')
      if (status) {
        const validStatuses = ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED']
        if (validStatuses.includes(status)) {
          updates.status = status
        }
      }
      
      if (Object.keys(updates).length > 0) {
        updates.updatedAt = new Date()
        
        await db
          .update(EventsTable)
          .set(updates)
          .where(eq(EventsTable.id, eventId))
        
        return NextResponse.json({
          success: true,
          data: { message: 'Event updated successfully' }
        })
      }
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
    console.error('Event Registration PATCH API Error:', error)
    
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