/*eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(protected)/dashboard/superadmin/users/create/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface FormData {
  name: string;
  email: string;
  password: string;
  role: "SUPER_ADMIN" | "ADMIN" | "AUTHOR" | "USER";
  mobile?: string;
  bio?: string;
  company?: string;
  designation?: string;
  location?: string;
  website?: string;
  isEntrepreneur: boolean;
  businessType?: string;
  
  // Author specific fields
  expertise?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    facebook?: string;
  };
}

export default function CreateUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    role: "USER",
    isEntrepreneur: false,
    socialLinks: {},
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert("User created successfully!");
        router.push("/dashboard/superadmin/users");
      } else {
        setError(data.error.message || "Failed to create user");
      }
    } catch (err) {
      setError("An error occurred while creating the user");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateSocialLink = (platform: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create New User</h1>
          <p className="text-muted-foreground">
            Add a new user to the platform with assigned role
          </p>
        </div>
      </div>

      {error && (
        <Card className="border-accent bg-accent/10">
          <CardContent className="pt-6">
            <p className="text-accent">{error}</p>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter secure password"
                  value={formData.password}
                  onChange={(e) => updateFormData("password", e.target.value)}
                  required
                  minLength={8}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile</Label>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="+91 1234567890"
                  value={formData.mobile}
                  onChange={(e) => updateFormData("mobile", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => updateFormData("role", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">User</SelectItem>
                    <SelectItem value="AUTHOR">Author</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="City, Country"
                  value={formData.location}
                  onChange={(e) => updateFormData("location", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Brief description about the user"
                value={formData.bio}
                onChange={(e) => updateFormData("bio", e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  placeholder="Company name"
                  value={formData.company}
                  onChange={(e) => updateFormData("company", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  placeholder="Job title"
                  value={formData.designation}
                  onChange={(e) => updateFormData("designation", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://example.com"
                  value={formData.website}
                  onChange={(e) => updateFormData("website", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="isEntrepreneur">Entrepreneur Status</Label>
                <Select
                  value={formData.isEntrepreneur ? "yes" : "no"}
                  onValueChange={(value) =>
                    updateFormData("isEntrepreneur", value === "yes")
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">Not an Entrepreneur</SelectItem>
                    <SelectItem value="yes">Entrepreneur</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.isEntrepreneur && (
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="businessType">Business Type</Label>
                  <Input
                    id="businessType"
                    placeholder="e.g., Tech Startup, Retail, Services"
                    value={formData.businessType}
                    onChange={(e) =>
                      updateFormData("businessType", e.target.value)
                    }
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Author Profile - Only shown if role is AUTHOR */}
        {formData.role === "AUTHOR" && (
          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="text-primary">
                Author Profile Information
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                An author profile will be automatically created for this user
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="expertise">Areas of Expertise</Label>
                <Input
                  id="expertise"
                  placeholder="e.g., Technology, Business, Leadership (comma-separated)"
                  value={formData.expertise}
                  onChange={(e) => updateFormData("expertise", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Separate multiple topics with commas
                </p>
              </div>

              <div className="space-y-4">
                <Label>Social Media Links</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="twitter" className="text-sm">
                      Twitter/X
                    </Label>
                    <Input
                      id="twitter"
                      placeholder="https://twitter.com/username"
                      value={formData.socialLinks?.twitter || ""}
                      onChange={(e) =>
                        updateSocialLink("twitter", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedin" className="text-sm">
                      LinkedIn
                    </Label>
                    <Input
                      id="linkedin"
                      placeholder="https://linkedin.com/in/username"
                      value={formData.socialLinks?.linkedin || ""}
                      onChange={(e) =>
                        updateSocialLink("linkedin", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instagram" className="text-sm">
                      Instagram
                    </Label>
                    <Input
                      id="instagram"
                      placeholder="https://instagram.com/username"
                      value={formData.socialLinks?.instagram || ""}
                      onChange={(e) =>
                        updateSocialLink("instagram", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="facebook" className="text-sm">
                      Facebook
                    </Label>
                    <Input
                      id="facebook"
                      placeholder="https://facebook.com/username"
                      value={formData.socialLinks?.facebook || ""}
                      onChange={(e) =>
                        updateSocialLink("facebook", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary/90"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating User...
              </>
            ) : (
              "Create User"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}