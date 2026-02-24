import { useEffect, useState } from "react";
import { addSellerProductAPI, getSingleSellerProductAPI, UpdateSellerProductAPI } from "../../APIs/sellerAPI.js";
import { useNavigate, useParams } from "react-router-dom";

const categories = ["Food", "Business", "Electronics", "Clothings"];

const SellerAddProduct = () => {

  const {id} = useParams(); //if id exist edit mode else add mode
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });

  const [images, setImages] = useState([]);

  useEffect(()=>{
    if(isEdit){
      loadProduct();
    }
  },[id]);

  const loadProduct = async()=>{
    const res = await getSingleSellerProductAPI(id);
    const p = res.data.product;

    setForm({
      name:p.name,
      description:p.description,
      price:p.price,
      stock:p.stock,
      category:p.category
    });
  };
  const [keyFeatures, setKeyFeatures] = useState([""]);
  const [specifications, setSpecifications] = useState([
    { label: "", value: "" }
  ]);

  const [loading, setLoading] = useState(false);

  // ----------------------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ----------------------------
  const handleAddFeature = () => {
    setKeyFeatures([...keyFeatures, ""]);
  };

  const handleFeatureChange = (index, value) => {
    const updated = [...keyFeatures];
    updated[index] = value;
    setKeyFeatures(updated);
  };

  // ----------------------------
  const handleAddSpecification = () => {
    setSpecifications([...specifications, { label: "", value: "" }]);
  };

  const handleSpecChange = (index, field, value) => {
    const updated = [...specifications];
    updated[index][field] = value;
    setSpecifications(updated);
  };

  // ----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const fd = new FormData();

      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("price", form.price);
      fd.append("stock", form.stock);
      fd.append("category", form.category);

      images.forEach(img => fd.append("images", img));

      fd.append("keyFeatures", JSON.stringify(
        keyFeatures.filter(f => f.trim() !== "")
      ));

      fd.append("specifications", JSON.stringify(
        specifications.filter(s => s.label && s.value)
      ));

      if(isEdit){
        await UpdateSellerProductAPI(id,fd);
        alert("Product updated and send for re-approval");
      }else{
        const res = await addSellerProductAPI(fd);
        alert(res.message);
      }
      navigate("/seller/products");

      

      setForm({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: ""
      });

      setImages([]);
      setKeyFeatures([""]);
      setSpecifications([{ label: "", value: "" }]);

    } catch (err) {
      alert(
        err?.response?.data?.message || "Product add failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-6">

      <h2 className="text-2xl font-semibold mb-6">
        {isEdit? "Edit Product": "Add New Product"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        
        <div className="grid md:grid-cols-2 gap-4">

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product name"
            className="border p-3 rounded"
            required
          />

          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="border p-3 rounded"
            required
          />

          <input
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            placeholder="Stock"
            className="border p-3 rounded"
            required
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border p-3 rounded"
            required
          >
            <option value="">Select category</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

        </div>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Product description"
          rows={4}
          className="border p-3 rounded w-full"
          required
        />

        
        <div>
          <label className="font-medium block mb-1">
            Product Images
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImages([...e.target.files])}
          />
        </div>

        
        <div>
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold">Key Features</h4>
            <button
              type="button"
              onClick={handleAddFeature}
              className="text-sm text-blue-600"
            >
              + Add
            </button>
          </div>

          <div className="space-y-2">
            {keyFeatures.map((f, i) => (
              <input
                key={i}
                value={f}
                onChange={(e) => handleFeatureChange(i, e.target.value)}
                placeholder={`Feature ${i + 1}`}
                className="border p-2 rounded w-full"
              />
            ))}
          </div>
        </div>

        
        <div>
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold">Specifications</h4>
            <button
              type="button"
              onClick={handleAddSpecification}
              className="text-sm text-blue-600"
            >
              + Add
            </button>
          </div>

          <div className="space-y-3">
            {specifications.map((s, i) => (
              <div key={i} className="grid grid-cols-2 gap-3">
                <input
                  placeholder="Label"
                  value={s.label}
                  onChange={(e) =>
                    handleSpecChange(i, "label", e.target.value)
                  }
                  className="border p-2 rounded"
                />
                <input
                  placeholder="Value"
                  value={s.value}
                  onChange={(e) =>
                    handleSpecChange(i, "value", e.target.value)
                  }
                  className="border p-2 rounded"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <button
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            {loading ? "Uploading..." :""}
            {isEdit? "Update Product":"Add Product"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default SellerAddProduct;
