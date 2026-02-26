import { useEffect, useMemo, useState } from "react";
import { getAllSellerAdmin } from "../../APIs/adminAPI.JS";
import { approveSellerAdmin,rejectSellerAdmin } from "../../APIs/adminAPI.JS";

const PAGE_SIZE = 10;

const SellerRequests = () => {

  const [sellers, setSellers] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getAllSellerAdmin();
    setSellers(res.sellers || []);
  };

  
  const requestedSellers = useMemo(() => {
    return sellers.filter(
      s =>
        s.isSellerRequested === true &&
        s.isSellerBlocked === false
    );
  }, [sellers]);

  const totalPages = Math.ceil(requestedSellers.length / PAGE_SIZE);

  const paginatedData = requestedSellers.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const approveSeller = async (id) => {
    await approveSellerAdmin(id);
    load();
  };

  const rejectSeller = async (id) => {
    await rejectSellerAdmin(id);
    load();
  };

  const getStatus = (s) => {
    if (s.isSellerApproved) return "Approved";
    if (s.isSellerRequested) return "Requested";
    return "Rejected";
  };

  const statusClass = (status) => {
    if (status === "Approved") return "bg-green-100 text-green-700";
    if (status === "Rejected") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="space-y-6 p-3 sm:p-5">

      
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Seller Requests
        </h1>
        <p className="text-sm text-gray-500">
          Review and manage new seller applications
        </p>
      </div>

      
      <div className="bg-white border rounded-xl overflow-hidden">

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-3 text-left">Seller ID</th>
                <th className="p-3 text-left">Seller Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="p-6 text-center text-gray-500"
                  >
                    No seller requests found
                  </td>
                </tr>
              )}

              {paginatedData.map((s) => {
                const status = getStatus(s);

                return (
                  <tr
                    key={s._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3 text-xs break-all">
                      {s._id}
                    </td>

                    <td className="p-3">
                      {s.usernamebox || "-"}
                    </td>

                    <td className="p-3">
                      {s.emailbox || "-"}
                    </td>

                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${statusClass(
                          status
                        )}`}
                      >
                        {status}
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="flex flex-col sm:flex-row gap-2 justify-center">

                        <button
                          disabled={s.isSellerApproved}
                          onClick={() => approveSeller(s._id)}
                          className="px-3 py-1 rounded text-xs border border-green-600 text-green-600 disabled:opacity-50"
                        >
                          Approve
                        </button>

                        <button
                          disabled={!s.isSellerRequested || s.isSellerApproved}
                          onClick={() => rejectSeller(s._id)}
                          className="px-3 py-1 rounded text-xs border border-red-600 text-red-600 disabled:opacity-50"
                        >
                          Reject
                        </button>

                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        
        {totalPages > 1 && (
          <div className="flex flex-wrap gap-2 justify-center p-4 border-t">

            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded text-sm disabled:opacity-50"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 border rounded text-sm ${
                  page === i + 1 ? "bg-gray-900 text-white" : ""
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 border rounded text-sm disabled:opacity-50"
            >
              Next
            </button>

          </div>
        )}

      </div>

    </div>
  );
};

export default SellerRequests;