/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { AuthorsTable, RoleAssignmentLogsTable, UsersTable } from "@/db/schema";
import { auth } from "@/auth";
import { and, desc, eq, like, or, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */
type Role = "SUPER_ADMIN" | "ADMIN" | "AUTHOR" | "USER";

const VALID_ROLES: Role[] = [
  "SUPER_ADMIN",
  "ADMIN",
  "AUTHOR",
  "USER",
];

/* -------------------------------------------------------------------------- */
/*                                   GET                                      */
/* -------------------------------------------------------------------------- */
export async function GET(req: NextRequest) {
  try {
    /* ----------------------------- AUTH CHECK ----------------------------- */
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication required",
          },
        },
        { status: 401 }
      );
    }

    if (session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "Super admin access required",
          },
        },
        { status: 403 }
      );
    }

    /* ----------------------------- QUERY PARAMS ---------------------------- */
    const searchParams = req.nextUrl.searchParams;

    const page = Math.max(parseInt(searchParams.get("page") || "1"), 1);
    const limit = Math.min(
      Math.max(parseInt(searchParams.get("limit") || "10"), 1),
      100
    );
    const offset = (page - 1) * limit;

    const search = searchParams.get("search");

    const deleted = searchParams.get("deleted") === "true";

    const suspended =
      searchParams.get("suspended") !== null
        ? searchParams.get("suspended") === "true"
        : undefined;

    const active =
      searchParams.get("active") !== null
        ? searchParams.get("active") === "true"
        : undefined;

    const entrepreneur =
      searchParams.get("entrepreneur") !== null
        ? searchParams.get("entrepreneur") === "true"
        : undefined;

    const newsletter =
      searchParams.get("newsletter") !== null
        ? searchParams.get("newsletter") === "true"
        : undefined;

    /* -------------------------- ROLE ENUM FIX ------------------------------ */
    const roleParam = searchParams.get("role");

    const role: Role | undefined =
      roleParam && VALID_ROLES.includes(roleParam as Role)
        ? (roleParam as Role)
        : undefined;

    /* ------------------------------- FILTERS ------------------------------- */
    const conditions: any[] = [];

    // Deleted filter (default: exclude deleted)
    if (deleted) {
      conditions.push(sql`${UsersTable.deletedAt} IS NOT NULL`);
    } else {
      conditions.push(sql`${UsersTable.deletedAt} IS NULL`);
    }

    // Role filter (ENUM SAFE)
    if (role) {
      conditions.push(eq(UsersTable.role, role));
    }

    // Suspension filter
    if (suspended !== undefined) {
      conditions.push(eq(UsersTable.isSuspended, suspended));
    }

    // Active filter
    if (active !== undefined) {
      conditions.push(eq(UsersTable.isActive, active));
    }

    // Entrepreneur filter
    if (entrepreneur !== undefined) {
      conditions.push(eq(UsersTable.isEntrepreneur, entrepreneur));
    }

    // Newsletter filter
    if (newsletter !== undefined) {
      conditions.push(
        eq(UsersTable.isNewsletterSubscribed, newsletter)
      );
    }

    // Search filter
    if (search) {
      conditions.push(
        or(
          like(UsersTable.name, `%${search}%`),
          like(UsersTable.email, `%${search}%`)
        )
      );
    }

    const whereCondition = and(...conditions);

    /* ------------------------------- COUNT -------------------------------- */
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(UsersTable)
      .where(whereCondition);

    /* ------------------------------- DATA --------------------------------- */
    const users = await db
      .select({
        id: UsersTable.id,
        name: UsersTable.name,
        email: UsersTable.email,
        role: UsersTable.role,
        isActive: UsersTable.isActive,
        isSuspended: UsersTable.isSuspended,
        isEntrepreneur: UsersTable.isEntrepreneur,
        isNewsletterSubscribed: UsersTable.isNewsletterSubscribed,
        lastLoginAt: UsersTable.lastLoginAt,
        createdAt: UsersTable.createdAt,
      })
      .from(UsersTable)
      .where(whereCondition)
      .orderBy(desc(UsersTable.createdAt))
      .limit(limit)
      .offset(offset);

    const total = Number(count);
    const totalPages = Math.ceil(total / limit);

    /* ------------------------------ RESPONSE ------------------------------- */
    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("GET /api/users error:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to fetch users",
        },
      },
      { status: 500 }
    );
  }
}




type UserRole = "SUPER_ADMIN" | "ADMIN" | "AUTHOR" | "USER";

/* -------------------------------------------------------------------------- */
/*                                   POST                                     */
/* -------------------------------------------------------------------------- */
export async function POST(req: NextRequest) {
  try {
    /* ----------------------------- AUTH CHECK ----------------------------- */
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication required",
          },
        },
        { status: 401 }
      );
    }

    // Get current user from database
    const [currentUser] = await db
      .select()
      .from(UsersTable)
      .where(eq(UsersTable.id, session.user.id))
      .limit(1);

    if (!currentUser || currentUser.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "Super admin access required",
          },
        },
        { status: 403 }
      );
    }

    /* ----------------------------- PARSE BODY ----------------------------- */
    const body = await req.json();

    const {
      name,
      email,
      password,
      role = "USER",
      mobile,
      bio,
      company,
      designation,
      location,
      website,
      isEntrepreneur = false,
      businessType,
      expertise,
      socialLinks,
    } = body;

    /* ---------------------------- VALIDATION ------------------------------ */
    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Name, email, and password are required",
          },
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid email format",
          },
        },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Password must be at least 8 characters long",
          },
        },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles: UserRole[] = ["SUPER_ADMIN", "ADMIN", "AUTHOR", "USER"];
    if (!validRoles.includes(role as UserRole)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid role",
          },
        },
        { status: 400 }
      );
    }

    /* -------------------------- CHECK EXISTING USER ----------------------- */
    const [existingUser] = await db
      .select({ id: UsersTable.id })
      .from(UsersTable)
      .where(eq(UsersTable.email, email))
      .limit(1);

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "CONFLICT",
            message: "A user with this email already exists",
          },
        },
        { status: 409 }
      );
    }

    /* --------------------------- HASH PASSWORD ---------------------------- */
    const hashedPassword = await bcrypt.hash(password, 10);

    /* --------------------------- PARSE EXPERTISE -------------------------- */
    let parsedExpertise = null;
    if (expertise && role === "AUTHOR") {
      parsedExpertise = expertise
        .split(",")
        .map((item: string) => item.trim())
        .filter((item: string) => item.length > 0);
    }

    /* --------------------------- CREATE USER ------------------------------ */
    const [newUser] = await db
      .insert(UsersTable)
      .values({
        name,
        email,
        password: hashedPassword,
        role: role as UserRole,
        mobile: mobile || null,
        bio: bio || null,
        company: company || null,
        designation: designation || null,
        location: location || null,
        website: website || null,
        isEntrepreneur,
        businessType: businessType || null,
        socialLinks: socialLinks || null,
        isActive: true,
        isSuspended: false,
        emailVerified: new Date(), // Auto-verify admin-created users
        roleAssignedBy: currentUser.id,
        roleAssignedAt: new Date(),
      })
      .returning({
        id: UsersTable.id,
        name: UsersTable.name,
        email: UsersTable.email,
        role: UsersTable.role,
      });

    /* ----------------------- LOG ROLE ASSIGNMENT -------------------------- */
    await db.insert(RoleAssignmentLogsTable).values({
      userId: newUser.id,
      assignedBy: currentUser.id,
      oldRole: null,
      newRole: role as UserRole,
      reason: "Initial role assignment by super admin",
    });

    /* --------------------- CREATE AUTHOR PROFILE -------------------------- */
    let authorProfile = null;
    if (role === "AUTHOR") {
      // Generate slug from name
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      // Check if slug already exists and append number if needed
      let finalSlug = slug;
      let counter = 1;
      
      while (true) {
        const [existingAuthor] = await db
          .select({ id: AuthorsTable.id })
          .from(AuthorsTable)
          .where(eq(AuthorsTable.slug, finalSlug))
          .limit(1);
        
        if (!existingAuthor) break;
        finalSlug = `${slug}-${counter}`;
        counter++;
      }

      const [author] = await db
        .insert(AuthorsTable)
        .values({
          userId: newUser.id,
          name: name,
          slug: finalSlug,
          email: email,
          bio: bio || "No bio provided yet",
          avatar: null,
          expertise: parsedExpertise,
          socialLinks: socialLinks || null,
          isVerified: true, // Auto-verify admin-created authors
          isFeatured: false,
          isActive: true,
        })
        .returning({
          id: AuthorsTable.id,
          slug: AuthorsTable.slug,
          name: AuthorsTable.name,
        });

      authorProfile = author;
    }

    /* ------------------------------ RESPONSE ------------------------------ */
    return NextResponse.json(
      {
        success: true,
        data: {
          user: newUser,
          authorProfile,
          message:
            role === "AUTHOR"
              ? "User and author profile created successfully"
              : "User created successfully",
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/users error:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to create user",
          details: process.env.NODE_ENV === "development" ? error.message : undefined,
        },
      },
      { status: 500 }
    );
  }
}