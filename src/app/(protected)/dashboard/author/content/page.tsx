// src/app/(protected)/dashboard/author/content/page.tsx
import { AuthorContentList } from "@/components/dashboard/author/AuthorContentList";

export default function AuthorContentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Content</h1>
        <p className="text-muted-foreground">
          Manage your articles, blogs, and stories
        </p>
      </div>
      <AuthorContentList />
    </div>
  );
}