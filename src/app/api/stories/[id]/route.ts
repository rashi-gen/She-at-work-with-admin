/*eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { StorySubmissionsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET single submission
export async function GET(
  req: NextRequest,
 context: { params: Promise<{ id: string; }> }
) {
  const params = await context.params;
  try {
    const { id } = params;

    const submission = await db
      .select()
      .from(StorySubmissionsTable)
      .where(eq(StorySubmissionsTable.id, id))
      .limit(1);

    if (!submission.length) {
      return NextResponse.json(
        { success: false, message: "Story submission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: submission[0],
    });

  } catch (error) {
    console.error("Error fetching story submission:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH update submission
export async function PATCH(
  req: NextRequest,
 context: { params: Promise<{ id: string;  }> }
) {
  const params = await context.params;
  try {
    const { id } = params;
    const body = await req.json();

    // Check if exists
    const existing = await db
      .select()
      .from(StorySubmissionsTable)
      .where(eq(StorySubmissionsTable.id, id))
      .limit(1);

    if (!existing.length) {
      return NextResponse.json(
        { success: false, message: "Story submission not found" },
        { status: 404 }
      );
    }

    const { status, reviewNotes, publishedContentId, reviewedBy } = body;
    const updateData: any = {};

    if (status) updateData.status = status;
    if (reviewNotes !== undefined) updateData.reviewNotes = reviewNotes;
    if (publishedContentId) updateData.publishedContentId = publishedContentId;
    if (reviewedBy) updateData.reviewedBy = reviewedBy;
    
    if (status && status !== "PENDING") {
      updateData.reviewedAt = new Date();
    }

    const [updated] = await db
      .update(StorySubmissionsTable)
      .set(updateData)
      .where(eq(StorySubmissionsTable.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      message: "Story submission updated successfully",
      data: updated,
    });

  } catch (error) {
    console.error("Error updating story submission:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}