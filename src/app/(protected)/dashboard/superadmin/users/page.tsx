// src/app/(protected)/dashboard/superadmin/users/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  Ban,
  CheckCircle,
  Edit,
  Plus,
  Search,
  Trash2,
  UserCheck,
  UserX,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "AUTHOR" | "USER";
  isActive: boolean;
  isSuspended: boolean;
  isEntrepreneur: boolean;
  isNewsletterSubscribed: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function UserManagementPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  const [filters, setFilters] = useState({
    search: "",
    role: "",
    active: "",
    suspended: "",
  });

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (filters.search) params.append("search", filters.search);
      if (filters.role) params.append("role", filters.role);
      if (filters.active) params.append("active", filters.active);
      if (filters.suspended) params.append("suspended", filters.suspended);

      const response = await fetch(`/api/users?${params}`);
      const data = await response.json();

      if (data.success) {
        setUsers(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}?role=${newRole}`, {
        method: "PATCH",
      });

      const data = await response.json();

      if (data.success) {
        fetchUsers();
      } else {
        alert(data.error.message);
      }
    } catch (error) {
      console.error("Error changing role:", error);
      alert("Failed to change role");
    }
  };

  const handleSuspendUser = async (userId: string, suspend: boolean) => {
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
        fetchUsers();
      } else {
        alert(data.error.message);
      }
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
      alert(`Failed to ${action} user`);
    }
  };

  const handleActivateUser = async (userId: string, activate: boolean) => {
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
        fetchUsers();
      } else {
        alert(data.error.message);
      }
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
      alert(`Failed to ${action} user`);
    }
  };

  const handleDeleteUser = async (userId: string) => {
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
        fetchUsers();
      } else {
        alert(data.error.message);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "bg-accent text-accent-foreground";
      case "ADMIN":
        return "bg-primary text-primary-foreground";
      case "AUTHOR":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">Manage all platform users</p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/superadmin/users/create")}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create User
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="pl-10"
              />
            </div>

            <Select
              value={filters.role}
              onValueChange={(value) => setFilters({ ...filters, role: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bn">All Roles</SelectItem>
                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="AUTHOR">Author</SelectItem>
                <SelectItem value="USER">User</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.active}
              onValueChange={(value) => setFilters({ ...filters, active: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gfh">All Status</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.suspended}
              onValueChange={(value) =>
                setFilters({ ...filters, suspended: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by suspension" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vnbv">All</SelectItem>
                <SelectItem value="true">Suspended</SelectItem>
                <SelectItem value="false">Not Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-muted-foreground">Loading users...</div>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium">User</th>
                    <th className="text-left p-4 font-medium">Role</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Last Login</th>
                    <th className="text-left p-4 font-medium">Created</th>
                    <th className="text-right p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-muted/20">
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Select
                          value={user.role}
                          onValueChange={(value) =>
                            handleRoleChange(user.id, value)
                          }
                        >
                          <SelectTrigger
                            className={`w-36 ${getRoleBadgeColor(user.role)}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SUPER_ADMIN">
                              Super Admin
                            </SelectItem>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                            <SelectItem value="AUTHOR">Author</SelectItem>
                            <SelectItem value="USER">User</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          {user.isActive ? (
                            <span className="inline-flex items-center text-sm text-green-600">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-sm text-red-600">
                              <UserX className="w-3 h-3 mr-1" />
                              Inactive
                            </span>
                          )}
                          {user.isSuspended && (
                            <span className="inline-flex items-center text-sm text-orange-600">
                              <Ban className="w-3 h-3 mr-1" />
                              Suspended
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {user.lastLoginAt
                          ? new Date(user.lastLoginAt).toLocaleDateString()
                          : "Never"}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              router.push(
                                `/dashboard/superadmin/users/${user.id}`
                              )
                            }
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleActivateUser(user.id, !user.isActive)
                            }
                          >
                            {user.isActive ? (
                              <UserX className="w-3 h-3" />
                            ) : (
                              <UserCheck className="w-3 h-3" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleSuspendUser(user.id, !user.isSuspended)
                            }
                          >
                            <Ban className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-accent hover:bg-accent hover:text-accent-foreground"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} users
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={!pagination.hasPrev}
              onClick={() =>
                setPagination({ ...pagination, page: pagination.page - 1 })
              }
            >
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={!pagination.hasNext}
              onClick={() =>
                setPagination({ ...pagination, page: pagination.page + 1 })
              }
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}