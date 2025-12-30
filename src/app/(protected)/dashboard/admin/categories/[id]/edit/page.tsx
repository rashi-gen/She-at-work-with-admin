'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const contentTypes = [
  { value: 'NEWS', label: 'News' },
  { value: 'BLOG', label: 'Blog' },
  { value: 'ENTRECHAT', label: 'Entrechat' },
  { value: 'SUCCESS_STORY', label: 'Success Story' },
  { value: 'RESOURCE', label: 'Resource' },
]

const formSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z.string()
    .min(1, 'Slug is required')
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only'),
  description: z.string().max(500).optional(),
  image: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  icon: z.string().optional(),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be a valid hex color').optional(),
  parentId: z.string().uuid().optional().nullable(),
  sortOrder: z.number().int().min(0).default(0),
  contentTypes: z.array(z.string()).optional().default([]),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
})

interface ParentCategory {
  id: string
  name: string
  slug: string
}

export default function EditCategoryPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [parentCategories, setParentCategories] = useState<ParentCategory[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      image: '',
      icon: '',
      color: '#3B82F6',
      parentId: null,
      sortOrder: 0,
      contentTypes: [],
      isActive: true,
      isFeatured: false,
    },
  })

  // Fetch category data
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/categories/${params.id}`)
        const data = await response.json()

        if (data.success) {
          const category = data.data
          form.reset({
            name: category.name,
            slug: category.slug,
            description: category.description || '',
            image: category.image || '',
            icon: category.icon || '',
            color: category.color || '#3B82F6',
            parentId: category.parentId || null,
            sortOrder: category.sortOrder,
            contentTypes: category.contentTypes || [],
            isActive: category.isActive,
            isFeatured: category.isFeatured,
          })
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
  }, [params.id, form, router])

  // Fetch parent categories
  useEffect(() => {
    const fetchParentCategories = async () => {
      try {
        const response = await fetch('/api/categories/tree')
        const data = await response.json()
        
        if (data.success) {
          // Filter out current category from parent options
          const filteredParents = data.data.flatList.filter(
            (cat: ParentCategory) => cat.id !== params.id
          )
          setParentCategories(filteredParents)
        }
      } catch (error) {
        console.error('Failed to fetch parent categories:', error)
      }
    }

    fetchParentCategories()
  }, [params.id])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setSaving(true)
      
      const response = await fetch(`/api/categories/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Category updated successfully')
        router.push('/dashboard/admin/categories')
        router.refresh()
      } else {
        toast.error(data.error || 'Failed to update category')
      }
    } catch (error) {
      toast.error('Failed to update category')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
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
            <h1 className="text-3xl font-bold tracking-tight">Edit Category</h1>
            <p className="text-muted-foreground">
              Update category details and settings
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Update the basic details of the category
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category Name *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Entrepreneurship" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL Slug *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., entrepreneurship" 
                            {...field} 
                            onChange={(e) => {
                              const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
                              field.onChange(value)
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Used in URLs. Must be lowercase with hyphens only.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe what this category is about..." 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category Settings</CardTitle>
                  <CardDescription>
                    Configure category behavior and display options
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="parentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parent Category</FormLabel>
                        <Select 
                          onValueChange={(value) => 
                            field.onChange(value === "null" ? null : value)
                          } 
                          value={field.value || "null"}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select parent category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="null">No parent (Root Category)</SelectItem>
                            {parentCategories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select a parent category if this is a sub-category
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sortOrder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sort Order</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0"
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormDescription>
                          Lower numbers appear first
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contentTypes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content Types</FormLabel>
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2">
                            {contentTypes.map((type) => (
                              <Badge
                                key={type.value}
                                variant={field.value?.includes(type.value) ? "default" : "outline"}
                                className="cursor-pointer"
                                onClick={() => {
                                  const newTypes = field.value?.includes(type.value)
                                    ? field.value.filter(t => t !== type.value)
                                    : [...(field.value || []), type.value]
                                  field.onChange(newTypes)
                                }}
                              >
                                {type.label}
                              </Badge>
                            ))}
                          </div>
                          <FormDescription>
                            Select which content types can use this category. Leave empty for all types.
                          </FormDescription>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Display Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="icon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Icon</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., 🚀 or Briefcase"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Icon to display with category
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color</FormLabel>
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded border"
                            style={{ backgroundColor: field.value }}
                          />
                          <FormControl>
                            <Input 
                              placeholder="#3B82F6"
                              {...field} 
                            />
                          </FormControl>
                        </div>
                        <FormDescription>
                          Color code (hex format)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://example.com/image.jpg"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Featured image for the category
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Status & Visibility</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Active Status
                          </FormLabel>
                          <FormDescription>
                            Make this category visible on the platform
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Featured
                          </FormLabel>
                          <FormDescription>
                            Highlight this category as featured
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Update Category'
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}