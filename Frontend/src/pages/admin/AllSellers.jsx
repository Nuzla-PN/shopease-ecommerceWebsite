import { useEffect, useState } from "react";
import { getAllSellerAdmin, blockSellerAdmin } from "../../APIs/adminAPI.JS";
import { CheckCircle, Clock, Slash, Store, User } from "lucide-react";

const AdminSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [filter, setFilter] = useState({ status: "All" });
  const [ currentPage,setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  useEffect(() => {
    loadSellers();
  }, []);

  const loadSellers = async () => {
    const res = await getAllSellerAdmin();
    setSellers(res.sellers || []);
  };

  const toggleBlock = async (id) => {
    await blockSellerAdmin(id);
    loadSellers();
  };

  const filteredSellers = sellers.filter((s) => {
    if (filter.status === "All") return true;
    if (filter.status === "Requested")
      return s.isSellerRequested && !s.isSellerApproved && !s.isSellerBlocked;
    if (filter.status === "Approved") return s.isSellerApproved && !s.isSellerBlocked;
    if (filter.status === "Rejected") return !s.isSellerApproved && !s.isSellerRequested;
    if (filter.status === "Blocked") return s.isSellerBlocked;
    return true;
  });

  const totalPages = Math.ceil(filteredSellers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSellers = filteredSellers.slice(startIndex, startIndex + itemsPerPage);
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const totalSellers = sellers.length;
  const activeSellers = sellers.filter((s) => s.isSellerApproved && !s.isSellerBlocked).length;
  const pendingSellers = sellers.filter((s) => s.isSellerRequested && !s.isSellerApproved && !s.isSellerBlocked).length;
  const blockedSellers = sellers.filter((s) => s.isSellerBlocked).length;

  return (
    <div className="space-y-6 p-4">

      
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sellers Management</h1>
        <p className="text-gray-500">Manage and monitor all platform sellers</p>
      </div>

     
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white shadow-lg rounded-lg p-6 flex items-center gap-6">
          <Store className="w-10 h-10 text-blue-600" />
          <div>
            <p className="text-gray-500 text-sm">Total Sellers</p>
            <p className="text-2xl font-bold">{totalSellers}</p>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 flex items-center gap-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
          <div>
            <p className="text-gray-500 text-sm">Active Sellers</p>
            <p className="text-2xl font-bold">{activeSellers}</p>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 flex items-center gap-6">
          <Clock className="w-10 h-10 text-yellow-600" />
          <div>
            <p className="text-gray-500 text-sm">Pending Sellers</p>
            <p className="text-2xl font-bold">{pendingSellers}</p>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 flex items-center gap-6">
          <User className="w-10 h-10 text-red-600" />
          <div>
            <p className="text-gray-500 text-sm">Blocked Sellers</p>
            <p className="text-2xl font-bold">{blockedSellers}</p>
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
          <option value="Requested">Requested</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Blocked">Blocked</option>
        </select>
      </div>

      
      <div className="overflow-x-auto mt-4">
        <table className="w-full min-w-[600px] text-sm border rounded-lg">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 text-left">Seller ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSellers.map((s) => {
              const status = s.isSellerBlocked
                ? "Blocked"
                : s.isSellerApproved
                ? "Approved"
                : s.isSellerRequested
                ? "Requested"
                : "Pending";

              const statusColor =
                status === "Blocked"
                  ? "bg-red-100 text-red-600"
                  : status === "Approved"
                  ? "bg-green-100 text-green-600"
                  : "bg-yellow-100 text-yellow-600";

              return (
                <tr key={s._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{s._id}</td>
                  <td className="p-3">{s.usernamebox || "N/A"}</td>
                  <td className="p-3">{s.emailbox || "N/A"}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColor}`}>
                      {status}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => toggleBlock(s._id)}
                      className={`px-3 py-1 rounded text-xs border font-semibold ${
                        s.isSellerBlocked
                          ? "border-green-600 text-green-600"
                          : "border-red-600 text-red-600"
                      }`}
                    >
                      {s.isSellerBlocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              );
            })}
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

export default AdminSellers;