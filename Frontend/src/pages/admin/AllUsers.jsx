import { useEffect, useState } from "react"; 
import { getAllUsersAdmin, blockUserAdmin } from "../../APIs/adminAPI.JS";
import { User, Users } from "lucide-react";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState({ status: "All", role: "All" });
  const [currentPage,setCurrentPage] = useState(1);
  const itemsPerPage=5;

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const res = await getAllUsersAdmin();
    setUsers(res.users || []);
  };

  const toggleBlock = async (id) => {
    await blockUserAdmin(id);
    loadUsers();
  };

  const filteredUsers = users.filter((u) => {
    const statusMatch =
      filter.status === "All" ||
      (filter.status === "Active" && !u.isUserBlocked) ||
      (filter.status === "Blocked" && u.isUserBlocked);
    const roleMatch =
      filter.role === "All" || filter.role.toLowerCase() === u.role;
    return statusMatch && roleMatch;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => !u.isUserBlocked).length;
  const blockedUsers = users.filter((u) => u.isUserBlocked).length;

  return (
    <div className="space-y-6 p-4">

      
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-500">Manage all platform users</p>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
  <div className="bg-white shadow-lg rounded-lg p-6 flex items-center gap-6">
    <Users className="w-10 h-10 text-blue-600" />
    <div>
      <p className="text-gray-500 text-sm">Total Users</p>
      <p className="text-2xl font-bold">{totalUsers}</p>
    </div>
  </div>

  <div className="bg-white shadow-lg rounded-lg p-6 flex items-center gap-6">
    <User className="w-10 h-10 text-green-600" />
    <div>
      <p className="text-gray-500 text-sm">Active Users</p>
      <p className="text-2xl font-bold">{activeUsers}</p>
    </div>
  </div>

  <div className="bg-white shadow-lg rounded-lg p-6 flex items-center gap-6">
    <User className="w-10 h-10 text-red-600" />
    <div>
      <p className="text-gray-500 text-sm">Blocked Users</p>
      <p className="text-2xl font-bold">{blockedUsers}</p>
    </div>
  </div>
</div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mt-2">
        <select
          className="border rounded px-3 py-2"
          value={filter.status}
          onChange={(e) =>
            setFilter((prev) => ({ ...prev, status: e.target.value }))
          }
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Blocked">Blocked</option>
        </select>

        <select
          className="border rounded px-3 py-2"
          value={filter.role}
          onChange={(e) =>
            setFilter((prev) => ({ ...prev, role: e.target.value }))
          }
        >
          <option value="All">All Roles</option>
          <option value="user">User</option>
          <option value="seller">Seller</option>
        </select>
      </div>

      
      <div className="overflow-x-auto mt-4">
        <table className="w-full min-w-[600px] text-sm border rounded-lg">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-center">Role</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((u) => (
              <tr key={u._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{u.usernamebox || "N/A"}</td>
                <td className="p-3">{u.emailbox || "N/A"}</td>
                <td className="p-3 text-center capitalize">{u.role}</td>
                <td className="p-3 text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      u.isUserBlocked
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {u.isUserBlocked ? "Blocked" : "Active"}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => toggleBlock(u._id)}
                    className={`px-3 py-1 rounded text-xs border font-semibold ${
                      u.isUserBlocked
                        ? "border-green-600 text-green-600"
                        : "border-red-600 text-red-600"
                    }`}
                  >
                    {u.isUserBlocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-2 py-2">{currentPage} / {totalPages}</span>
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminUsers;