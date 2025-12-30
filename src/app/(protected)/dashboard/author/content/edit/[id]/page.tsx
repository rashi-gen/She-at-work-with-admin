// src/app/(protected)/dashboard/author/content/edit/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { ContentEditor } from "@/components/dashboard/author/ContentEditor";

export default function EditContentPage() {
  const params = useParams();
  const contentId = params.id as string;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Content</h1>
        <p className="text-muted-foreground">
          Update your content and submit for review
        </p>
      </div>
      <ContentEditor contentId={contentId} />
    </div>
  );
}