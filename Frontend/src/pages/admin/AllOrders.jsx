import { useEffect, useState } from "react";
import { getAllOrdersForAdmin } from "../../APIs/adminAPI.JS";

const ITEMS_PER_PAGE = 10;

const AdminOrders = () => {

  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const res = await getAllOrdersForAdmin();
    setOrders(res.orders || []);
  };

  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);

  const paginatedOrders = orders.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="p-3 sm:p-4 space-y-5">

      <div>
        <h1 className="text-xl sm:text-2xl font-bold">All Orders</h1>
        <p className="text-sm sm:text-base text-gray-500">
          View and manage all customer orders
        </p>
      </div>

      
      <div className="space-y-4 md:hidden">

        {paginatedOrders.map((o) => (
          <div
            key={o._id}
            className="bg-white border rounded-lg p-4 space-y-3"
          >

            <div>
              <p className="text-sm font-semibold">
                Order ID
              </p>
              <p className="text-xs text-gray-500 break-all">
                {o._id}
              </p>
            </div>

            <div className="text-sm">
              <p className="font-medium">
                {o.user?.usernamebox || "User"}
              </p>
              <p className="text-xs text-gray-500">
                {o.user?.emailbox}
              </p>
            </div>

            <div className="flex justify-between text-sm">
              <span>Total</span>
              <span className="font-semibold">
                ₹{o.totalAmount}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Items</span>
              <span>{o.orderItems?.length || 0}</span>
            </div>

            <div>
              <span
                className={`inline-block px-2 py-1 rounded text-xs font-semibold
                  ${
                    o.status === "delivered"
                      ? "bg-green-100 text-green-600"
                      : o.status === "cancelled"
                      ? "bg-red-100 text-red-600"
                      : "bg-yellow-100 text-yellow-600"
                  }
                `}
              >
                {o.status}
              </span>
            </div>

            <div className="text-xs text-gray-500">
              {new Date(o.createdAt).toLocaleString()}
            </div>

          </div>
        ))}

      </div>

      <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto">

        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-center">Items</th>
              <th className="p-3 text-center">Total</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Date</th>
            </tr>
          </thead>

          <tbody>
            {paginatedOrders.map((o) => (
              <tr key={o._id} className="border-b">

                <td className="p-3 text-xs break-all">
                  {o._id}
                </td>

                <td className="p-3">
                  <div>{o.user?.usernamebox || "User"}</div>
                  <div className="text-xs text-gray-500">
                    {o.user?.emailbox}
                  </div>
                </td>

                <td className="p-3 text-center">
                  {o.orderItems?.length || 0}
                </td>

                <td className="p-3 text-center font-semibold">
                  ₹{o.totalAmount}
                </td>

                <td className="p-3 text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold
                      ${
                        o.status === "delivered"
                          ? "bg-green-100 text-green-600"
                          : o.status === "cancelled"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-600"
                      }
                    `}
                  >
                    {o.status}
                  </span>
                </td>

                <td className="p-3 text-center text-xs">
                  {new Date(o.createdAt).toLocaleDateString()}
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center gap-3">

          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-3 py-1 border rounded text-sm disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="px-3 py-1 border rounded text-sm disabled:opacity-50"
          >
            Next
          </button>

        </div>
      )}

    </div>
  );
};

export default AdminOrders;