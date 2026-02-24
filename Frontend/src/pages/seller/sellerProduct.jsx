// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { deleteSellerProductAPI, getSellerProductAPI } from "../../APIs/sellerAPI.js";


// const tabs = ["all", "approved", "pending","rejected"];

// const SellerProducts = () => {

//   const navigate = useNavigate();

//   const [products, setProducts] = useState([]);
//   const [activeTab, setActiveTab] = useState("all");
//   const [loading, setLoading] = useState(true);

//   const loadProducts = async () => {
//     try {
//       const data = await getSellerProductAPI();
//       setProducts(data.products);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadProducts();
//   }, []);

//   const handleDelete = async (id) => {

//     const ok = window.confirm("Are you sure you want to delete this product?");

//     if (!ok) return;

//     try {
//       await deleteSellerProductAPI(id);
//       setProducts((prev) => prev.filter(p => p._id !== id));
//     } catch (error) {
//       alert("Delete failed");
//       console.log(error);
//     }
//   };

//   const filteredProducts = products.filter(p => {

//     if (activeTab === "approved") return p.isApproved === true;
//     if (activeTab === "pending") return p.isApproved === false;

//     return true;
//   });

//   if (loading) {
//     return <div className="p-4">Loading products...</div>;
//   }

//   return (
//     <div className="p-4 max-w-7xl mx-auto">

//       {/* top Add product button*/}
//       <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-5">
//         <h2 className="text-2xl font-semibold">My Products</h2>

//         <button
//           onClick={() => navigate("/seller/add-product")}
//           className="border px-4 py-2 rounded"
//         >
//           Add Product
//         </button>
//       </div>

      
//       <div className="flex gap-2 mb-6 flex-wrap">
//         {tabs.map(t => (
//           <button key={t} onClick={() => setActiveTab(t)}
//             className={`px-4 py-1 border rounded capitalize
//             ${activeTab === t ? "bg-blue-600 text-white" : ""}`}
//           > {t} 
//           </button>
//         ))}
//       </div>

//       {/* Products grid */}
//       {filteredProducts.length === 0 ? (
//         <p className="text-gray-500">No products found</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

//           {filteredProducts.map(p => (

//             <div
//               key={p._id}
//               className="border rounded overflow-hidden bg-white"
//             >

//               <img
//                 src={p.images?.[0]?.url}
//                 className="w-full h-40 object-cover"
//                 alt=""
//               />

//               <div className="p-3">

//                 <div className="flex justify-between items-start">
//                   <h4 className="font-medium line-clamp-1">
//                     {p.name}
//                   </h4>

//                   <span
//                     className={`text-xs px-2 py-1 rounded text-white
//                     ${p.isApproved ? "bg-green-600" : "bg-yellow-500"}`}
//                   >
//                     {p.isApproved ? "Approved" : "Pending"}
//                   </span>
//                 </div>

//                 <p className="text-sm text-gray-600 mt-1">
//                   ₹ {p.price}
//                 </p>

//                 <p className="text-xs text-gray-500">
//                   Stock : {p.stock}
//                 </p>

//                 {/* Edit and delete */}

//                 <div className="flex gap-2 mt-3 flex-wrap">

//                   <button
//                     onClick={() =>
//                       navigate(`/seller/products/edit/${p._id}`)
//                     }
//                     className="border px-3 py-1 rounded text-sm"
//                   >
//                     Edit
//                   </button>

//                   <button
//                     onClick={() => handleDelete(p._id)}
//                     className="border px-3 py-1 rounded text-sm text-red-600 border-red-500"
//                   >
//                     Delete
//                   </button>

//                 </div>

//               </div>
//             </div>

//           ))}

//         </div>
//       )}

//     </div>
//   );
// };

// export default SellerProducts;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Plus, Pencil, Eye, Trash2 } from "lucide-react";
import { deleteSellerProductAPI, getSellerProductAPI } from "../../APIs/sellerAPI.js";


const tabs = ["all", "approved", "pending","rejected"]
const SellerProducts = () => {

  const [products, setProducts] = useState([]);
  const [activeTab,setActiveTab] = useState("all");

  const filteredProducts = products.filter(p => {

    if (activeTab === "approved") return p.status === "approved";
    if (activeTab === "pending") return p.status === "pending";
    if(activeTab === "rejected") return p.status === "rejected";

    return true;
  });

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const loadProducts = async () => {
    try {
      const res = await getSellerProductAPI();
      setProducts(res.products || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handledelete = async(id)=>{
    if(!window.confirm("Are you sure you want to delete this product?"))
      return;
    await deleteSellerProductAPI(id);
    loadProducts();
  };

  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading products...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Package className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">
            My Products
          </h2>
        </div>

        <button
          onClick={() => navigate("/seller/add-product")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

<div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-1 border rounded capitalize
            ${activeTab === t ? "bg-blue-600 text-white" : ""}`}
          > {t} 
          </button>
        ))}
      </div>
      
      <div className="hidden md:block bg-white rounded-xl border shadow-sm overflow-hidden">

        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr className="text-sm text-gray-600 text-left">
              <th className="px-7 py-3">Product</th>
              <th className="px-7 py-3">Price</th>
              <th className="px-7 py-3">Stock</th>
              <th className="px-10 py-3">Status</th>
              <th className="px-10 py-3">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filteredProducts.map((p) => (
              <tr key={p._id} className="hover:bg-gray-50">

                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.images?.[0]?.url}
                      className="w-12 h-12 rounded object-cover border"
                    />
                    <div>
                      <p className="font-medium text-gray-800">
                        {p.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {p.category}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">₹ {p.price}</td>
                <td className="px-9 py-4">{p.stock}</td>

                
                  <td className="px-7 py-4">
                    {p.status === "approved" ? (
                      <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                        Approved
                      </span>
                    ) : p.status === "rejected" ? (
                      <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-700">
                        Rejected
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                        Pending
                      </span>
                    )}
                  
                </td>

                <td className="px-5 py-4">
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        navigate(`/seller/view-product/${p._id}`)
                      }
                      className="p-2 rounded hover:bg-gray-100"
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/seller/products/edit/${p._id}`)
                      }
                      className="p-2 rounded hover:bg-gray-100 text-blue-600"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => handledelete(p._id)}
                      className="text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

      </div>

      {/* mobile cards */}
      <div className="grid gap-4 md:hidden">
        {filteredProducts.map((p) => (
          <div
            key={p._id}
            className="bg-white border rounded-xl p-4 shadow-sm space-y-3"
          >
            <div className="flex gap-3">
              <img
                src={p.images?.[0]?.url}
                className="w-16 h-16 rounded object-cover border"
              />

              <div className="flex-1">
                <h3 className="font-medium">{p.name}</h3>
                <p className="text-sm text-gray-500">{p.category}</p>
                <p className="text-sm mt-1">₹ {p.price}</p>
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <span>Stock : {p.stock}</span>
              {p.status==="approved" ? (
                <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">Approved</span>
              ) : p.status === "rejected" ?(
                <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-700">Rejected</span>
                ) : (
                      <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                        Pending
                      </span>
                    )}
  
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() =>
                  navigate(`/seller/view-product/${p._id}`)
                }
                className="flex-1 border rounded-lg py-2 text-sm"
              >
                View
              </button>

              <button
                onClick={() =>
                  navigate(`/seller/products/edit/${p._id}`)
                }
                className="flex-1 border rounded-lg py-2 text-sm text-blue-600"
              >
                Edit
              </button>

              <button
                onClick={() => handledelete(p._id)}
                className="flex-1 border rounded-lg py-2 text-sm text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="bg-white border rounded-xl p-10 text-center text-gray-500">
          No products found
        </div>
      )}

    </div>
  );
};

export default SellerProducts;
