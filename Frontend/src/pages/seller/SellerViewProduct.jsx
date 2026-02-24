import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteSellerProductAPI, getSingleSellerProductAPI } from "../../APIs/sellerAPI.js";


const SellerViewProduct = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => {
    try {
        const res= await getSingleSellerProductAPI(id);
        setProduct(res.product);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {

    const ok = window.confirm("Are you sure you want to delete this product?");

    if (!ok) return;

    try {
      await deleteSellerProductAPI(id);
      alert("Product deleted successfully");
      navigate("/seller/products");
    } catch (error) {
      console.log(error);
      alert("Delete failed");
    }
  };

  if (loading) return <p className="p-5">Loading...</p>;
  if (!product) return <p className="p-5">Product not found</p>;

  
  let statusText = "Pending";
  let statusClass = "bg-yellow-100 text-yellow-700";

  if (product.status) {
    if (product.status === "approved") {
      statusText = "Approved";
      statusClass = "bg-green-100 text-green-700";
    } else if (product.status === "rejected") {
      statusText = "Rejected";
      statusClass = "bg-red-100 text-red-700";
    }
  } else {
    if (product.isApproved === true) {
      statusText = "Approved";
      statusClass = "bg-green-100 text-green-700";
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6">

      <h2 className="text-2xl font-semibold mb-4">Product Details <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusClass}`}>
          {statusText}
        </span></h2>

      <div className="grid md:grid-cols-2 gap-6">

        <div className="grid grid-cols-2 gap-3">
          {product.images.map((img, i) => (
            <img
              key={i}
              src={img.url}
              alt=""
              className="w-full h-100 object-cover rounded border"
            />
          ))}
        </div>

        {/* Details */}
        <div className="space-y-3">
          <p><b>Name :</b> {product.name}</p>
          <p><b>Description :</b> {product.description}</p>
          <p><b>Price :</b> ₹ {product.price}</p>
          <p><b>Stock :</b> {product.stock}</p>
          <p><b>Category :</b> {product.category}</p>

          {product.keyFeatures?.length > 0 && (
            <div>
              <p className="font-semibold">Key Features</p>
              <ul className="list-disc ml-5">
                {product.keyFeatures.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          )}

          {product.specifications?.length > 0 && (
            <div>
              <p className="font-semibold">Specifications</p>
              <ul className="ml-2">
                {product.specifications.map((s, i) => (
                  <li key={i}>
                    {s.label} : {s.value}
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </div>

      {/* bottom buttons */}
      <div className="flex gap-4 mt-8">

        <button
          onClick={() => navigate(`/seller/products/edit/${product._id}`)}
          className="px-5 py-2 bg-blue-600 text-white rounded"
        >
          Edit Product
        </button>

        <button
          onClick={handleDelete}
          className="px-5 py-2 bg-red-600 text-white rounded"
        >
          Delete Product
        </button>

      </div>

    </div>
  );
};

export default SellerViewProduct;