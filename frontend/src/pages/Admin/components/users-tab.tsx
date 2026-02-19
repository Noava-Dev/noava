"use client"

import React, { useState } from "react"
import { LuSearch, LuUsers, LuTrash2, LuPencil, LuPlus } from "react-icons/lu"
import { Button } from "flowbite-react" 

export interface PlatformUser {
  id: string
  name: string
  email: string
  role: "admin" | "student"
  joinedAt: Date
  imageUrl?: string
}

// Mock data for now
// TODO: replace with real data
const MOCK_USERS: PlatformUser[] = [
  {
    id: "1",
    name: "Jane Doe",
    email: "jane@example.com",
    role: "admin",
    joinedAt: new Date("2025-01-15"),
  },
  {
    id: "2",
    name: "John Smith",
    email: "john@example.com",
    role: "student",
    joinedAt: new Date("2025-10-20"),
  },
]

const roleColors: Record<string, string> = {
  admin: "bg-blue-100 text-blue-700",
  student: "bg-gray-100 text-gray-600",
}

export default function UsersTab() {
  const [users, setUsers] = useState<PlatformUser[]>(MOCK_USERS)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")

  // Filter Logic
  const filtered = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const handleDelete = (id: string) => {
    // TODO: add confirmModal here
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers((prev) => prev.filter((u) => u.id !== id))
    }
  }

  const handleEdit = (id: string) => {
    // TODO: add edit modal and functionality
    console.log("Edit user:", id)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Users</h3>
          <p className="text-sm text-gray-500">
            Manage platform users and roles.
          </p>
        </div>

        <Button className="flex items-center gap-2">
          <LuPlus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>

      <div className="space-y-5">
        {/* Search and Filter */}
        {/* TODO: add proper search tools */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <LuSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-4 pr-8 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-44"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="student">Student</option>
          </select>
        </div>

        {/* User Table */}
        {filtered.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-10 text-center">
            <LuUsers className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-3 text-sm text-gray-500">
              No users match your search.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                <tr>
                  <th className="px-6 py-3 font-medium">User</th>
                  <th className="px-6 py-3 font-medium">Role</th>
                  <th className="px-6 py-3 font-medium">Joined</th>
                  <th className="px-6 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    {/* User Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.imageUrl ? (
                          <img
                            src={user.imageUrl}
                            alt={user.name}
                            className="h-9 w-9 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-600">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                          roleColors[user.role]
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4">
                      {user.joinedAt.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(user.id)}
                          className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                          title="Edit User"
                        >
                          <LuPencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-red-600 transition-colors"
                          title="Delete User"
                        >
                          <LuTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}