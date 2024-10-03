import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Toast } from "primereact/toast";
import { ScrollPanel } from "primereact/scrollpanel";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { FileUpload } from "primereact/fileupload";

const AddProducts = () => {
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    title: "",
    price: null,
    category: "",
    description: "",
    variants: [{ color: "", size: "", stock: null }],
    image: [],
  });
  const token = useSelector((state) => state.auth.token);

  const showMessage = (severity, summary, detail) => {
    toast.current.show({ severity, summary, detail, life: 5000 });
  };

  const handleInputChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...data.variants];
    newVariants[index][field] = value;
    setData((prev) => ({ ...prev, variants: newVariants }));
  };

  const addVariant = () => {
    if (data.variants.some((v) => !v.color || !v.size || v.stock === null)) {
      // showMessage('warn', 'Incomplete Variant', 'Please fill in all fields for the existing variant before adding a new one.');
      return;
    }
    setData((prev) => ({
      ...prev,
      variants: [...prev.variants, { color: "", size: "", stock: null }],
    }));
  };

  const removeVariant = (index) => {
    const newVariants = data.variants.filter((_, i) => i !== index);
    setData((prev) => ({ ...prev, variants: newVariants }));
  };

  const handleUpload = async (event) => {
    const files = event.files;
    try {
      setLoading(true);
      const uploadPromises = files.map((file) => {
        const formData = new FormData();
        formData.append("my_files", file);
        return axios.post("http://localhost:3001/api/image/upload", formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
      });
      const results = await Promise.all(uploadPromises);
      const imageUrls = results.map((res) => res.data[0].secure_url);
      setData((prev) => ({ ...prev, image: [...prev.image, ...imageUrls] }));
      showMessage(
        "success",
        "Upload Successful",
        "Images uploaded successfully"
      );
    } catch (error) {
      showMessage(
        "error",
        "Upload Failed",
        error.response?.data?.message ||
          "Error uploading images. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      showMessage(
        "warn",
        "Incomplete Form",
        "Please fill in all required fields and upload at least one image."
      );
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3001/api/products", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showMessage(
        "success",
        "Product Added",
        "Your product has been successfully added to the database."
      );
      setData({
        title: "",
        price: null,
        category: "",
        description: "",
        variants: [{ color: "", size: "", stock: null }],
        image: [],
      });
    } catch (error) {
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage =
              "Invalid product data. Please check your inputs and try again.";
            break;
          case 401:
            errorMessage =
              "You are not authorized to add products. Please log in again.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            errorMessage = error.response.data.message || errorMessage;
        }
      }
      showMessage("error", "Error Adding Product", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      data.title &&
      data.price &&
      data.category &&
      data.description &&
      data.variants.every((v) => v.color && v.size && v.stock !== null) &&
      data.image.length > 0
    );
  };

  return (
    <ScrollPanel style={{ width: '100%', height: '100%' }} className="absolute">
    <form className="p-4 max-w-4xl mx-auto" onSubmit={handleSubmit}>
      <Toast ref={toast} />
      <h2 className="text-2xl font-bold mb-6 text-[#FA61D0]">Add Product</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-float-label">
          <InputText
            id="title"
            value={data.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            className="w-full"
          />
          <label htmlFor="title">Title</label>
        </div>
        <div className="p-float-label">
          <InputNumber
            id="price"
            value={data.price}
            onValueChange={(e) => handleInputChange("price", e.value)}
            mode="currency"
            currency="USD"
            className="w-full"
          />
          <label htmlFor="price">Price</label>
        </div>
        <div className="p-float-label">
          <Dropdown
            id="category"
            value={data.category}
            options={["Electronics", "Clothing", "Books", "Home & Garden"]}
            onChange={(e) => handleInputChange("category", e.value)}
            className="w-full"
          />
          <label htmlFor="category">Category</label>
        </div>
        <div>
          <FileUpload
            mode="basic"
            multiple
            accept="image/*"
            maxFileSize={1000000}
            customUpload
            uploadHandler={handleUpload}
            auto
            chooseLabel="Upload Images"
            className="w-full"
          />
        </div>
      </div>

      <div className="mt-6">
        <span className="p-float-label">
          <InputTextarea
            id="description"
            value={data.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            rows={5}
            className="w-full"
          />
          <label htmlFor="description">Description</label>
        </span>
      </div>

      <h3 className="text-xl font-semibold mt-6 mb-4 text-[#FA61D0]">
        Variants
      </h3>
      {data.variants.map((variant, index) => (
        <div key={index} className="flex flex-wrap items-center gap-4 mb-4">
          <InputText
            placeholder="Color"
            value={variant.color}
            onChange={(e) =>
              handleVariantChange(index, "color", e.target.value)
            }
            className="flex-1"
          />
          <InputText
            placeholder="Size"
            value={variant.size}
            onChange={(e) => handleVariantChange(index, "size", e.target.value)}
            className="flex-1"
          />
          <InputNumber
            placeholder="Stock"
            value={variant.stock}
            onValueChange={(e) => handleVariantChange(index, "stock", e.value)}
            className="flex-1"
          />
          <Button
            icon="pi pi-trash"
            onClick={() => removeVariant(index)}
            className="p-button-danger p-button-text"
            disabled={data.variants.length === 1}
          />
        </div>
      ))}
      <Button
        icon="pi pi-plus"
        onClick={addVariant}
        label="Add Variant"
        className="mb-6 bg-[#FA61D0]"
      />

      <div className="flex justify-between items-center mt-2">
        <Button
          type="submit"
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded-full transition-all hover:bg-green-600"
          label={loading ? "Adding Product..." : "Add Product"}
          icon="pi pi-check"
        />
        {loading && (
          <ProgressSpinner style={{ width: "50px", height: "50px" }} />
        )}
      </div>

      {data.image.length > 0 && (
        <div className="flex flex-wrap gap-4 mt-6">
          {data.image.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Product ${index + 1}`}
              className="w-24 h-24 object-cover rounded-lg shadow-md"
            />
          ))}
        </div>
      )}
    </form>
    </ScrollPanel>
  );
};

export default AddProducts;
