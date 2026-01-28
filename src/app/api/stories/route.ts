import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { StorySubmissionsTable } from "@/db/schema";
import { desc, eq, and, or, like, count } from "drizzle-orm";

// GET all submissions
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    const whereConditions = [];

    if (status) {
      whereConditions.push(eq(StorySubmissionsTable.status, status as "DRAFT" | "PENDING" | "PUBLISHED" | "ARCHIVED" | "REJECTED"));
    }

    if (search) {
      const searchPattern = `%${search}%`;
      whereConditions.push(
        or(
          like(StorySubmissionsTable.name, searchPattern),
          like(StorySubmissionsTable.title, searchPattern),
          like(StorySubmissionsTable.businessName, searchPattern),
          like(StorySubmissionsTable.industry, searchPattern)
        )
      );
    }

    const submissions = await db
      .select()
      .from(StorySubmissionsTable)
      .where(
        whereConditions.length > 0
          ? and(...whereConditions)
          : undefined
      )
      .orderBy(desc(StorySubmissionsTable.submittedAt))
      .limit(limit)
      .offset(offset);

    // Get total count
    const totalResult = await db
      .select({ count: count() })
      .from(StorySubmissionsTable)
      .where(
        whereConditions.length > 0
          ? and(...whereConditions)
          : undefined
      );

    const total = Number(totalResult[0]?.count) || 0;

    return NextResponse.json({
      success: true,
      data: submissions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error("Error fetching story submissions:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST new submission (your existing code)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, email, phone, title, story, businessName, industry, images } = body;

    if (!name || !email || !title || !story) {
      return NextResponse.json(
        { success: false, message: "Required fields are missing" },
        { status: 400 }
      );
    }

    const [submission] = await db
      .insert(StorySubmissionsTable)
      .values({
        name,
        email,
        phone: phone || null,
        title,
        story,
        businessName: businessName || null,
        industry: industry || null,
        images: images || null,
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        message: "Story submitted successfully",
        data: submission,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Story submission error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}