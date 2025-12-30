/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { UsersTable } from "@/db/schema";
import { auth } from "@/auth";
import { and, desc, eq, like, or, sql } from "drizzle-orm";

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
