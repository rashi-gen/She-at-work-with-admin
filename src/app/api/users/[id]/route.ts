/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/db'
import { 
  UsersTable,
  RoleAssignmentLogsTable 
} from '@/db/schema'
import { eq } from 'drizzle-orm'

type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'AUTHOR' | 'USER'

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

    // Get current user from database
    const [currentUser] = await db
      .select()
      .from(UsersTable)
      .where(eq(UsersTable.id, session.user.id))
      .limit(1)
      
    if (!currentUser) {
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
    
    // Only SUPER_ADMIN can modify users
    if (currentUser.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Super admin access required'
          }
        },
        { status: 403 }
      )
    }
    
    const userId = params.id
    
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'BAD_REQUEST',
            message: 'User ID is required'
          }
        },
        { status: 400 }
      )
    }
    
    const searchParams = req.nextUrl.searchParams
    
    // Get existing user
    const [existingUser] = await db
      .select()
      .from(UsersTable)
      .where(eq(UsersTable.id, userId))
      .limit(1)
    
    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'User not found'
          }
        },
        { status: 404 }
      )
    }
    
    // Cannot modify another SUPER_ADMIN (except maybe yourself, but that's risky)
    if (existingUser.role === 'SUPER_ADMIN' && existingUser.id !== currentUser.id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Cannot modify another super admin'
          }
        },
        { status: 403 }
      )
    }
    
    const updates: any = {}
    
    // Change role
    const roleParam = searchParams.get('role')
    const validRoles: UserRole[] = ['SUPER_ADMIN', 'ADMIN', 'AUTHOR', 'USER']
    
    if (roleParam && validRoles.includes(roleParam as UserRole)) {
      const newRole = roleParam as UserRole
      
      if (newRole !== existingUser.role) {
        // Cannot demote the last SUPER_ADMIN
        if (existingUser.role === 'SUPER_ADMIN' && newRole !== 'SUPER_ADMIN') {
          // Check if this is the only SUPER_ADMIN
          const superAdmins = await db
            .select({ id: UsersTable.id })
            .from(UsersTable)
            .where(eq(UsersTable.role, 'SUPER_ADMIN'))
            
          if (superAdmins.length === 1 && superAdmins[0].id === existingUser.id) {
            return NextResponse.json(
              {
                success: false,
                error: {
                  code: 'FORBIDDEN',
                  message: 'Cannot demote the only super admin'
                }
              },
              { status: 403 }
            )
          }
        }
        
        // Log role change
        await db
          .insert(RoleAssignmentLogsTable)
          .values({
            userId,
            assignedBy: currentUser.id,
            oldRole: existingUser.role,
            newRole: newRole,
            reason: searchParams.get('reason') || 'Role change by super admin'
          })
        
        updates.role = newRole
        updates.roleAssignedBy = currentUser.id
        updates.roleAssignedAt = new Date()
      }
    }
    
    // Suspend user
    const suspend = searchParams.get('suspend')
    if (suspend === 'true') {
      updates.isSuspended = true
      updates.suspensionReason = searchParams.get('reason') || 'Suspended by admin'
      
      const suspendedUntil = searchParams.get('suspendedUntil')
      if (suspendedUntil) {
        const suspensionDate = new Date(suspendedUntil)
        if (isNaN(suspensionDate.getTime())) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'VALIDATION_ERROR',
                message: 'Invalid suspension date format'
              }
            },
            { status: 400 }
          )
        }
        updates.suspendedUntil = suspensionDate
      }
    } else if (suspend === 'false') {
      updates.isSuspended = false
      updates.suspensionReason = null
      updates.suspendedUntil = null
    }
    
    // Activate/deactivate user
    const active = searchParams.get('active')
    if (active === 'false') {
      updates.isActive = false
    } else if (active === 'true') {
      updates.isActive = true
    }
    
    // Hard delete user
    const hardDelete = searchParams.get('hardDelete')
    if (hardDelete === 'true') {
      // Prevent deleting yourself
      if (existingUser.id === currentUser.id) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'FORBIDDEN',
              message: 'Cannot delete yourself'
            }
          },
          { status: 403 }
        )
      }
      
      await db
        .delete(UsersTable)
        .where(eq(UsersTable.id, userId))
      
      return NextResponse.json({
        success: true,
        data: { message: 'User permanently deleted' }
      })
    }
    
    if (Object.keys(updates).length > 0) {
      updates.updatedAt = new Date()
      
      const [updated] = await db
        .update(UsersTable)
        .set(updates)
        .where(eq(UsersTable.id, userId))
        .returning({
          id: UsersTable.id,
          name: UsersTable.name,
          email: UsersTable.email,
          role: UsersTable.role,
          isActive: UsersTable.isActive,
          isSuspended: UsersTable.isSuspended,
          suspendedUntil: UsersTable.suspendedUntil,
          suspensionReason: UsersTable.suspensionReason
        })
      
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
    console.error('User Management PATCH API Error:', error)
    
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