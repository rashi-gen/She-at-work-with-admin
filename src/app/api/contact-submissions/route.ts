// /app/api/contact-submissions
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { ContactSubmissionsTable } from "@/db/schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name,
      email,
      phone,
      subject,
      message,
    } = body;

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, email, and message are required",
        },
        { status: 400 }
      );
    }

    const [submission] = await db
      .insert(ContactSubmissionsTable)
      .values({
        name,
        email,
        phone: phone || null,
        subject: subject || null,
        message,
        // isResolved defaults to false
        // submittedAt defaults automatically
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        message: "Your message has been submitted successfully",
        data: submission,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact submission error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
