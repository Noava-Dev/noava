import { useState, useEffect } from "react";
import { LuSearch, LuUsers, LuTrash2, LuPlus } from "react-icons/lu";
import { userService } from "../../../services/UserService";
import type { ClerkUserResponse } from "../../../models/User";
import ConfirmModal from "../../../shared/components/ConfirmModal";
import Loading from "../../../shared/components/loading/Loading";

const roleColors: Record<string, string> = {
  teacher: "bg-[#E6F8F2] text-[#009966] dark:bg-[#009966] dark:text-[#E6F8F2]",
  student:
    "bg-primary-200 text-text-title-light",
};

export default function UsersTab() {
  const [users, setUsers] = useState<ClerkUserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const { getUsers, deleteUser } = userService();

  //delete a user:
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = users.filter((user) => {
    const fullName = `${user.firstName || ""} ${
      user.lastName || ""
    }`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const role = user.isTeacher ? "teacher" : "student";
    const matchesRole = roleFilter === "all" || role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleDeleteClick = (clerkId: string) => {
    setUserToDelete(clerkId);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser(userToDelete);
      setUsers((prev) => prev.filter((u) => u.clerkId !== userToDelete));
    } catch (error) {
      alert("Failed to delete user.");
    } finally {
      setShowConfirm(false);
      setUserToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setUserToDelete(null);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-text-title-light dark:text-text-title-dark">
            Users
          </h3>
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
            Manage platform users and roles.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Search and Filter */}
        <div className="p-4 border shadow-sm border-border dark:border-border-dark bg-background-app-light dark:bg-background-surface-dark rounded-2xl md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold tracking-wide uppercase text-text-muted-light dark:text-text-muted-dark">
                Search
              </label>

              <div className="relative">
                <LuSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-border dark:border-border-dark bg-background-app-light dark:bg-background-app-dark py-2.5 pl-10 pr-4 text-sm text-text-body-light dark:text-text-body-dark focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>

              {searchQuery && (
                <p className="flex items-center gap-1 text-xs text-text-body-light dark:text-text-body-dark">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary-500"></span>
                  {filtered.length} found
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold tracking-wide uppercase text-text-muted-light dark:text-text-muted-dark">
                Filter by Role
              </label>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="rounded-xl border border-border dark:border-border-dark bg-background-app-light dark:bg-background-app-dark py-2.5 px-4 text-sm text-text-body-light dark:text-text-body-dark focus:ring-2 focus:ring-primary-500 focus:outline-none w-full"
              >
                <option value="all">All Roles</option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
              </select>
            </div>
          </div>
        </div>

        {/* User Table */}
        {loading ? (
          <Loading />
        ) : filtered.length === 0 ? (
          <div className="rounded-lg border bg-background-app-light dark:bg-background-app-dark p-10 text-center">
            <LuUsers className="mx-auto h-12 w-12 text-text-muted-light dark:text-text-muted-dark" />
            <p className="mt-3 text-sm text-text-muted-light dark:text-text-muted-dark">
              No users match your search.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border dark:border-border-dark bg-background-app-light dark:bg-background-surface-dark shadow-sm">
            <table className="w-full text-left text-sm text-text-body-light dark:text-text-body-dark">
              <thead className="bg-background-surface-light dark:bg-background-app-dark text-xs uppercase text-text-muted-light dark:text-text-muted-dark">
                <tr>
                  <th className="px-6 py-3 font-medium">User</th>
                  <th className="px-6 py-3 font-medium">Role</th>
                  <th className="px-6 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border dark:divide-border-dark">
                {filtered.map((user) => (
                  <tr
                    key={user.clerkId}
                    className="hover:bg-primary-100/40 dark:hover:bg-primary-700/30 transition-colors"
                  >
                    {/* User Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-500  text-xs font-semibold text-text-title-dark">
                          {user.firstName?.charAt(0)}
                          {user.lastName?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-text-body-light dark:text-text-body-dark">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                          user.isTeacher
                            ? roleColors.teacher
                            : roleColors.student
                        }`}
                      >
                        {user.isTeacher ? "Teacher" : "Student"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {!user.isOwner && (
                          <button
                            onClick={() => handleDeleteClick(user.clerkId)}
                            className="rounded-md p-2 text-text-muted-light dark:text-text-muted-dark dark:bg-background-surface-dark hover:bg-gray-100 hover:border-none hover:text-red-600 transition-colors"
                            title="Delete User"
                          >
                            <LuTrash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <ConfirmModal
        show={showConfirm}
        title="Delete User"
        message="Are you sure you want to permanently delete this user? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmColor="red"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
