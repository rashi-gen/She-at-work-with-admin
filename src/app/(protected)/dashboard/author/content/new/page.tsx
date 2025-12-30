// src/app/(protected)/dashboard/author/content/new/page.tsx

import { ContentEditor } from "@/components/dashboard/author/ContentEditor"


export default function NewContentPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create New Content</h1>
        <p className="text-muted-foreground">
          Share your knowledge and experiences with the community
        </p>
      </div>
      <ContentEditor />
    </div>
  );
}