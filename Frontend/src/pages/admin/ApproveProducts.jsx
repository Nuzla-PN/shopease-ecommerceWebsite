import { useEffect, useState } from "react";
import {
  getAllProductsForAdmin,
  approveProductAdmin,
  rejectProductAdmin
} from "../../APIs/adminAPI.js";

const ITEMS_PER_PAGE = 10;

const AdminProductsApproval = () => {

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [viewProduct, setViewProduct] = useState(null);
  const [filter, setFilter] = useState("pending");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const res = await getAllProductsForAdmin();
    setProducts(res.products || []);
  };

  const approveProduct = async (id) => {
    await approveProductAdmin(id);
    await loadProducts();
    setViewProduct(null);
  };

  const rejectProduct = async (id) => {
    await rejectProductAdmin(id);
    await loadProducts();
    setViewProduct(null);
  };


  const filteredProducts =
    filter === "all"
      ? products
      : products.filter(p => p.status === filter);



  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="p-3 sm:p-4 space-y-5">

      
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Product Approval</h1>
        <p className="text-sm sm:text-base text-gray-500">
          Approve or reject seller products
        </p>
      </div>

   
      <div className="flex gap-3 flex-wrap">

        <button
          onClick={() => { setFilter("all"); setPage(1); }}
          className={`px-4 py-2 rounded text-sm font-medium border
            ${filter === "all"
              ? "bg-gray-800 text-white"
              : "bg-white text-gray-600"}
          `}
        >
          All
        </button>

        <button
          onClick={() => { setFilter("pending"); setPage(1); }}
          className={`px-4 py-2 rounded text-sm font-medium border
            ${filter === "pending"
              ? "bg-yellow-500 text-white border-yellow-500"
              : "bg-white text-gray-600"}
          `}
        >
          Pending
        </button>

        <button
          onClick={() => { setFilter("approved"); setPage(1); }}
          className={`px-4 py-2 rounded text-sm font-medium border
            ${filter === "approved"
              ? "bg-green-600 text-white border-green-600"
              : "bg-white text-gray-600"}
          `}
        >
          Approved
        </button>

      </div>

   
      <div className="space-y-4 md:hidden">
        {paginatedProducts.map((p) => (
          <div
            key={p._id}
            className="bg-white rounded-lg border p-4 space-y-3"
          >

            <div>
              <p className="font-semibold">{p.name}</p>
              <p className="text-xs text-gray-500">{p.category}</p>
            </div>

            <div className="text-sm">
              <p className="font-medium">{p.seller?.usernamebox}</p>
              <p className="text-xs text-gray-500">
                {p.seller?.emailbox}
              </p>
            </div>

            <div className="flex justify-between text-sm">
              <span>Price</span>
              <span className="font-semibold">₹{p.price}</span>
            </div>

            <div>
              <span
                className={`inline-block px-2 py-1 rounded text-xs font-semibold
                ${
                  p.status === "approved"
                    ? "bg-green-100 text-green-600"
                    : p.status === "rejected"
                    ? "bg-red-100 text-red-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {p.status}
              </span>
            </div>

            {p.status === "pending" && (
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => approveProduct(p._id)}
                  className="flex-1 px-3 py-2 border rounded text-xs border-green-600 text-green-600"
                >
                  Approve
                </button>

                <button
                  onClick={() => rejectProduct(p._id)}
                  className="flex-1 px-3 py-2 border rounded text-xs border-red-600 text-red-600"
                >
                  Reject
                </button>
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={() => setViewProduct(p)}
                className="w-full px-3 py-2 border rounded text-xs"
              >
                View product
              </button>
            </div>

          </div>
        ))}
      </div>

   
      <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto">

        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Seller</th>
              <th className="p-3 text-center">Price</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Action</th>
              <th className="p-3 text-center">View</th>
            </tr>
          </thead>

          <tbody>
            {paginatedProducts.map((p) => (
              <tr key={p._id} className="border-b">

                <td className="p-3">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-gray-500">{p.category}</div>
                </td>

                <td className="p-3">
                  <div>{p.seller?.usernamebox}</div>
                  <div className="text-xs text-gray-500">
                    {p.seller?.emailbox}
                  </div>
                </td>

                <td className="p-3 text-center">₹{p.price}</td>

                <td className="p-3 text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold
                    ${
                      p.status === "approved"
                        ? "bg-green-100 text-green-600"
                        : p.status === "rejected"
                        ? "bg-red-100 text-red-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>

                <td className="p-3 text-center space-x-2">
                  {p.status === "pending" && (
                    <>
                      <button
                        onClick={() => approveProduct(p._id)}
                        className="px-3 py-1 border rounded text-xs border-green-600 text-green-600"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => rejectProduct(p._id)}
                        className="px-3 py-1 border rounded text-xs border-red-600 text-red-600"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>

                <td className="p-3 text-center">
                  <button
                    onClick={() => setViewProduct(p)}
                    className="px-3 py-1 border rounded text-xs"
                  >
                    View
                  </button>
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

    
      {viewProduct && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-3">

          <div className="bg-white w-full max-w-3xl rounded-lg p-4 overflow-y-auto max-h-[90vh]">

            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold">{viewProduct.name}</h2>
              <button
                onClick={() => setViewProduct(null)}
                className="text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
              {viewProduct.images?.map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  alt=""
                  className="h-28 w-full object-cover rounded border"
                />
              ))}
            </div>

            <div className="space-y-2 text-sm">
              <p><b>Description :</b> {viewProduct.description}</p>
              <p><b>Category :</b> {viewProduct.category}</p>
              <p><b>Price :</b> ₹{viewProduct.price}</p>
              <p><b>Stock :</b> {viewProduct.stock}</p>
              <p>
                <b>Seller :</b> {viewProduct.seller?.usernamebox} ({viewProduct.seller?.emailbox})
              </p>
            </div>

            {viewProduct.keyFeatures?.length > 0 && (
              <div className="mt-3">
                <p className="font-semibold text-sm">Key Features</p>
                <ul className="list-disc pl-5 text-sm">
                  {viewProduct.keyFeatures.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            )}

            {viewProduct.specifications?.length > 0 && (
              <div className="mt-3">
                <p className="font-semibold text-sm">Specifications</p>
                <div className="space-y-1 text-sm">
                  {viewProduct.specifications.map((s, i) => (
                    <div key={i}>
                      {s.label} : {s.value}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {viewProduct.status === "pending" && (
              <div className="flex justify-end gap-3 mt-5">

                <button
                  onClick={() => approveProduct(viewProduct._id)}
                  className="px-4 py-2 border rounded text-sm border-green-600 text-green-600"
                >
                  Approve
                </button>

                <button
                  onClick={() => rejectProduct(viewProduct._id)}
                  className="px-4 py-2 border rounded text-sm border-red-600 text-red-600"
                >
                  Reject
                </button>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminProductsApproval;