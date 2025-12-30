'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Calendar, Edit, Link as LinkIcon, Loader2, User } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  icon: string | null
  color: string | null
  parentId: string | null
  sortOrder: number
  contentTypes: string[] | null
  isActive: boolean
  isFeatured: boolean
  createdAt: string
  updatedAt: string
  creator: {
    id: string
    name: string
    email: string
  } | null
  parentCategory: {
    id: string
    name: string
    slug: string
  } | null
}

export default function CategoryDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<Category | null>(null)

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/categories/${params.id}`)
        const data = await response.json()

        if (data.success) {
          setCategory(data.data)
        } else {
          toast.error(data.error || 'Failed to fetch category')
          router.push('/dashboard/admin/categories')
        }
      } catch (error) {
        toast.error('Failed to fetch category')
        console.error(error)
        router.push('/dashboard/admin/categories')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchCategory()
    }
  }, [params.id, router])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!category) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/admin/categories">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
            <p className="text-muted-foreground">
              Category details and information
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/dashboard/admin/categories/${category.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Category
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Category Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {category.icon && (
                    <span className="text-2xl">{category.icon}</span>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <LinkIcon className="h-4 w-4 text-muted-foreground" />
                      <code className="bg-muted px-2 py-1 rounded text-sm">
                        /category/{category.slug}
                      </code>
                    </div>
                  </div>
                </div>

                {category.description && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-medium mb-2">Description</h4>
                      <p className="text-muted-foreground">{category.description}</p>
                    </div>
                  </>
                )}

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Parent Category</h4>
                    {category.parentCategory ? (
                      <Badge variant="outline" className="text-sm">
                        {category.parentCategory.name}
                      </Badge>
                    ) : (
                      <p className="text-muted-foreground text-sm">None (Root Category)</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Sort Order</h4>
                    <p className="text-muted-foreground text-sm">{category.sortOrder}</p>
                  </div>
                </div>

                {category.contentTypes && category.contentTypes.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-medium mb-2">Content Types</h4>
                      <div className="flex flex-wrap gap-2">
                        {category.contentTypes.map((type) => (
                          <Badge key={type} variant="secondary">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {category.image && (
            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video overflow-hidden rounded-lg">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="object-cover w-full h-full"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status & Properties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Active Status</h4>
                <Badge variant={category.isActive ? "default" : "secondary"}>
                  {category.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Featured</h4>
                <Badge variant={category.isFeatured ? "default" : "outline"}>
                  {category.isFeatured ? 'Yes' : 'No'}
                </Badge>
              </div>

              {category.color && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Color</h4>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: category.color }}
                    />
                    <code className="text-sm">{category.color}</code>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timestamps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <h4 className="text-sm font-medium">Created</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatDate(category.createdAt)}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <h4 className="text-sm font-medium">Last Updated</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatDate(category.updatedAt)}
                </p>
              </div>
            </CardContent>
          </Card>

          {category.creator && (
            <Card>
              <CardHeader>
                <CardTitle>Created By</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{category.creator.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {category.creator.email}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}