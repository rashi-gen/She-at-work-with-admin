import { db } from "@/db";
import { AuthorsTable } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const authors = await db
      .select({
        id: AuthorsTable.id,
        name: AuthorsTable.name,
      })
      .from(AuthorsTable)
      .where(eq(AuthorsTable.isActive, true))
      .orderBy(asc(AuthorsTable.name));
    
    return NextResponse.json({
      success: true,
      data: authors,
    });
  } catch (error) {
    console.error("Error fetching authors:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}