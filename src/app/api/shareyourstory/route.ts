import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { StorySubmissionsTable } from "@/db/schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name,
      email,
      phone,
      title,
      story,
      businessName,
      industry,
      images,
    } = body;

    // Basic validation
    if (!name || !email || !title || !story) {
      return NextResponse.json(
        {
          success: false,
          message: "Required fields are missing",
        },
        { status: 400 }
      );
    }

    // Insert into DB
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
        // status defaults to PENDING
        // submittedAt defaults automatically
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
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
