/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { UsersTable, AuthorsTable } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/auth'
import { hash } from 'bcryptjs'

/* -------------------------------------------------------------------------- */
/*                                   GET                                      */
/* -------------------------------------------------------------------------- */
export async function GET(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        },
        { status: 401 }
      )
    }

    const [userData] = await db
      .select({
        id: UsersTable.id,
        name: UsersTable.name,
        email: UsersTable.email,
        mobile: UsersTable.mobile,
        image: UsersTable.image,
        role: UsersTable.role,
        bio: UsersTable.bio,
        company: UsersTable.company,
        designation: UsersTable.designation,
        location: UsersTable.location,
        website: UsersTable.website,
        socialLinks: UsersTable.socialLinks,
        isEntrepreneur: UsersTable.isEntrepreneur,
        businessType: UsersTable.businessType,
        industryFocus: UsersTable.industryFocus,
        yearsOfExperience: UsersTable.yearsOfExperience,
        isNewsletterSubscribed: UsersTable.isNewsletterSubscribed,
        preferences: UsersTable.preferences,
        lastLoginAt: UsersTable.lastLoginAt,
        isActive: UsersTable.isActive,
        createdAt: UsersTable.createdAt,
        updatedAt: UsersTable.updatedAt,
        author: {
          id: AuthorsTable.id,
          name: AuthorsTable.name,
          slug: AuthorsTable.slug,
          avatar: AuthorsTable.avatar,
          isVerified: AuthorsTable.isVerified,
          isFeatured: AuthorsTable.isFeatured,
        },
      })
      .from(UsersTable)
      .leftJoin(AuthorsTable, eq(UsersTable.id, AuthorsTable.userId))
      .where(eq(UsersTable.id, session.user.id))
      .limit(1)

    if (!userData) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'User not found',
          },
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: userData,
    })
  } catch (error) {
    console.error('GET /user error:', error)

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Something went wrong',
        },
      },
      { status: 500 }
    )
  }
}

/* -------------------------------------------------------------------------- */
/*                                   PUT                                      */
/* -------------------------------------------------------------------------- */
export async function PUT(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        },
        { status: 401 }
      )
    }

    const body = await req.json()
    const updates: any = {}

    // Allowed self-update fields
    if (body.name !== undefined) updates.name = body.name
    if (body.mobile !== undefined) updates.mobile = body.mobile
    if (body.image !== undefined) updates.image = body.image
    if (body.bio !== undefined) updates.bio = body.bio
    if (body.company !== undefined) updates.company = body.company
    if (body.designation !== undefined) updates.designation = body.designation
    if (body.location !== undefined) updates.location = body.location
    if (body.website !== undefined) updates.website = body.website
    if (body.socialLinks !== undefined) updates.socialLinks = body.socialLinks
    if (body.isEntrepreneur !== undefined) updates.isEntrepreneur = body.isEntrepreneur
    if (body.businessType !== undefined) updates.businessType = body.businessType
    if (body.industryFocus !== undefined) updates.industryFocus = body.industryFocus
    if (body.yearsOfExperience !== undefined)
      updates.yearsOfExperience = body.yearsOfExperience
    if (body.preferences !== undefined) updates.preferences = body.preferences
    if (body.isNewsletterSubscribed !== undefined)
      updates.isNewsletterSubscribed = body.isNewsletterSubscribed

    // Password update
    if (body.newPassword) {
      updates.password = await hash(body.newPassword, 10)
    }

    updates.updatedAt = new Date()

    const [updatedUser] = await db
      .update(UsersTable)
      .set(updates)
      .where(eq(UsersTable.id, session.user.id))
      .returning({
        id: UsersTable.id,
        name: UsersTable.name,
        email: UsersTable.email,
        mobile: UsersTable.mobile,
        image: UsersTable.image,
        role: UsersTable.role,
      })

    return NextResponse.json({
      success: true,
      data: updatedUser,
    })
  } catch (error) {
    console.error('PUT /user error:', error)

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to update profile',
        },
      },
      { status: 500 }
    )
  }
}

/* -------------------------------------------------------------------------- */
/*                                  DELETE                                    */
/* -------------------------------------------------------------------------- */
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        },
        { status: 401 }
      )
    }

    await db
      .update(UsersTable)
      .set({
        deletedAt: new Date(),
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(UsersTable.id, session.user.id))

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully',
    })
  } catch (error) {
    console.error('DELETE /user error:', error)

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to delete account',
        },
      },
      { status: 500 }
    )
  }
}
