import { Metadata } from 'next'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import CategoriesTable from '@/components/dashboard/admin/categories/CategoriesTable'

export const metadata: Metadata = {
  title: 'Categories Management | Admin Dashboard',
  description: 'Manage content categories',
}

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories Management</h1>
          <p className="text-muted-foreground">
            Create, edit, and manage content categories for your platform
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/admin/categories/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Category
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
          <CardDescription>
            Manage your content categories. Categories help organize and structure your content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CategoriesTable />
        </CardContent>
      </Card>
    </div>
  )
}