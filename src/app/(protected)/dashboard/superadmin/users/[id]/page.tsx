/*eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(protected)/dashboard/superadmin/users/[id]/page.tsx
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
import {
  AlertTriangle,
  ArrowLeft,
  Ban,
  Loader2,
  Save,
  Trash2,
  UserCheck,
  UserX,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "AUTHOR" | "USER";
  mobile: string | null;
  bio: string | null;
  company: string | null;
  designation: string | null;
  location: string | null;
  website: string | null;
  isActive: boolean;
  isSuspended: boolean;
  suspensionReason: string | null;
  suspendedUntil: string | null;
  isEntrepreneur: boolean;
  businessType: string | null;
  lastLoginAt: string | null;
  createdAt: string;
}

interface AuthorProfile {
  id: string;
  slug: string;
  expertise: string[] | null;
  socialLinks: any;
  isVerified: boolean;
  isFeatured: boolean;
  articlesCount: number;
}

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [authorProfile, setAuthorProfile] = useState<AuthorProfile | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();

      if (data.success) {
        setUser(data.data.user);
        setAuthorProfile(data.data.authorProfile);
      } else {
        setError(data.error.message);
      }
    } catch (err) {
      setError("Failed to load user details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (data.success) {
        alert("User updated successfully!");
        fetchUserDetails();
      } else {
        setError(data.error.message);
      }
    } catch (err) {
      setError("Failed to update user");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleRoleChange = async (newRole: string) => {
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}?role=${newRole}`, {
        method: "PATCH",
      });

      const data = await response.json();

      if (data.success) {
        alert("Role updated successfully!");
        fetchUserDetails();
      } else {
        alert(data.error.message);
      }
    } catch (err) {
      alert("Failed to update role");
      console.error(err);
    }
  };

  const handleSuspend = async () => {
    const suspend = !user?.isSuspended;
    const action = suspend ? "suspend" : "unsuspend";
    
    if (!confirm(`Are you sure you want to ${action} this user?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}?suspend=${suspend}`, {
        method: "PATCH",
      });

      const data = await response.json();

      if (data.success) {
        alert(`User ${action}ed successfully!`);
        fetchUserDetails();
      } else {
        alert(data.error.message);
      }
    } catch (err) {
      alert(`Failed to ${action} user`);
      console.error(err);
    }
  };

  const handleToggleActive = async () => {
    const activate = !user?.isActive;
    const action = activate ? "activate" : "deactivate";
    
    if (!confirm(`Are you sure you want to ${action} this user?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}?active=${activate}`, {
        method: "PATCH",
      });

      const data = await response.json();

      if (data.success) {
        alert(`User ${action}d successfully!`);
        fetchUserDetails();
      } else {
        alert(data.error.message);
      }
    } catch (err) {
      alert(`Failed to ${action} user`);
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to permanently delete this user? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}?hardDelete=true`, {
        method: "PATCH",
      });

      const data = await response.json();

      if (data.success) {
        alert("User deleted successfully!");
        router.push("/dashboard/superadmin/users");
      } else {
        alert(data.error.message);
      }
    } catch (err) {
      alert("Failed to delete user");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Card className="border-accent">
          <CardContent className="pt-6">
            <p className="text-accent">{error || "User not found"}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleToggleActive}
            className={user.isActive ? "text-accent" : "text-green-600"}
          >
            {user.isActive ? (
              <>
                <UserX className="w-4 h-4 mr-2" />
                Deactivate
              </>
            ) : (
              <>
                <UserCheck className="w-4 h-4 mr-2" />
                Activate
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleSuspend}
            className="text-orange-600"
          >
            <Ban className="w-4 h-4 mr-2" />
            {user.isSuspended ? "Unsuspend" : "Suspend"}
          </Button>
          <Button
            variant="outline"
            onClick={handleDelete}
            className="text-accent hover:bg-accent hover:text-accent-foreground"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Status Alerts */}
      {user.isSuspended && (
        <Card className="border-orange-600 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-orange-900">User Suspended</h3>
                {user.suspensionReason && (
                  <p className="text-sm text-orange-700">
                    Reason: {user.suspensionReason}
                  </p>
                )}
                {user.suspendedUntil && (
                  <p className="text-sm text-orange-700">
                    Until: {new Date(user.suspendedUntil).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!user.isActive && (
        <Card className="border-accent bg-accent/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <UserX className="w-5 h-5 text-accent" />
              <p className="text-accent font-medium">This user is inactive</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={user.role} onValueChange={handleRoleChange}>
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
              <Label htmlFor="mobile">Mobile</Label>
              <Input
                id="mobile"
                value={user.mobile || ""}
                onChange={(e) => setUser({ ...user, mobile: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={user.location || ""}
                onChange={(e) => setUser({ ...user, location: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastLogin">Last Login</Label>
              <Input
                id="lastLogin"
                value={
                  user.lastLoginAt
                    ? new Date(user.lastLoginAt).toLocaleString()
                    : "Never"
                }
                disabled
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={user.bio || ""}
              onChange={(e) => setUser({ ...user, bio: e.target.value })}
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
                value={user.company || ""}
                onChange={(e) => setUser({ ...user, company: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="designation">Designation</Label>
              <Input
                id="designation"
                value={user.designation || ""}
                onChange={(e) =>
                  setUser({ ...user, designation: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={user.website || ""}
                onChange={(e) => setUser({ ...user, website: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessType">Business Type</Label>
              <Input
                id="businessType"
                value={user.businessType || ""}
                onChange={(e) =>
                  setUser({ ...user, businessType: e.target.value })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Author Profile */}
      {authorProfile && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="text-primary">Author Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">Slug</Label>
                <p className="font-medium">{authorProfile.slug}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  Articles
                </Label>
                <p className="font-medium">{authorProfile.articlesCount}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  Verified
                </Label>
                <p className="font-medium">
                  {authorProfile.isVerified ? "Yes" : "No"}
                </p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  Featured
                </Label>
                <p className="font-medium">
                  {authorProfile.isFeatured ? "Yes" : "No"}
                </p>
              </div>
            </div>
            {authorProfile.expertise && authorProfile.expertise.length > 0 && (
              <div>
                <Label className="text-sm text-muted-foreground">
                  Expertise
                </Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {authorProfile.expertise.map((item, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary hover:bg-primary/90"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}