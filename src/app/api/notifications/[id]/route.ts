/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { NotificationsTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@/auth";

/* -------------------------------------------------------------------------- */
/*                                   PATCH                                    */
/* -------------------------------------------------------------------------- */
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
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

    const userId = session.user.id;
    const notificationId = params.id;
    const searchParams = req.nextUrl.searchParams;

    /* ------------------------------ DELETE -------------------------------- */
    const deleteParam = searchParams.get("delete");
    if (deleteParam === "true") {
      await db
        .delete(NotificationsTable)
        .where(
          and(
            eq(NotificationsTable.id, notificationId),
            eq(NotificationsTable.userId, userId)
          )
        );

      return NextResponse.json({
        success: true,
        message: "Notification deleted",
      });
    }

    /* ------------------------------- UPDATE ------------------------------- */
    const updates: any = {};

    const read = searchParams.get("read");
    if (read === "true") {
      updates.isRead = true;
      updates.readAt = new Date();
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "BAD_REQUEST",
            message: "No valid action specified",
          },
        },
        { status: 400 }
      );
    }

    const [updatedNotification] = await db
      .update(NotificationsTable)
      .set(updates)
      .where(
        and(
          eq(NotificationsTable.id, notificationId),
          eq(NotificationsTable.userId, userId)
        )
      )
      .returning();

    return NextResponse.json({
      success: true,
      data: updatedNotification,
    });
  } catch (error) {
    console.error("PATCH /notifications error:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to update notification",
        },
      },
      { status: 500 }
    );
  }
}
