"use client";

import React, { ChangeEvent, FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, ArrowLeft, Loader } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";

const categories = [
  "Fruits & Vegitables",
  "Biscuits & Cookies",
  "Soft Drinks",
  "Rice,Atta & Flour",
  "Baby & PetCare",
  "Household & Personal Care",
  "Dairy & Bakery",
  "Packaged Food",
];

const units = ["Kg", "g", "litre", "ml", "piece", "pack"];

const AddGrocery = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [unit, setUnit] = useState("");
  const [price, setPrice] = useState("");

  const [preview, setPreview] = useState<string | null>(null);
  const [backendImage, setBackendImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  /* ---------------- Image Handler ---------------- */
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBackendImage(file);
    setPreview(URL.createObjectURL(file));
  };

  /* ---------------- Submit Handler ---------------- */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);

    if (!name || !category || !price || !unit) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("unit", unit);

      if (backendImage) {
        formData.append("image", backendImage);
      }

      const res = await axios.post("/api/admin/add-grocery", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(res.data);
      setLoading(false);

      alert("Product added successfully!");
    } catch (error) {
      console.error(error);
      setLoading(false);

      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8"
      >
        {/* Back Button */}
        <Link
          href="/"
          className="absolute top-6 left-6 rounded-full bg-green-400 p-1"
        >
          <ArrowLeft className="w-4 h-4 text-white" />
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">
            Add Grocery Product
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Enter product details to add a new grocery item
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="space-y-6"
        >
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Product Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Fresh Organic Apples"
              className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border rounded-xl px-4 py-2.5"
              >
                <option value="" disabled>
                  Select category
                </option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="w-full border rounded-xl px-4 py-2.5"
              />
            </div>
          </div>

          {/* Unit */}
          <div>
            <label className="block text-sm font-medium mb-1">Unit</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full border rounded-xl px-4 py-2.5"
            >
              <option value="" disabled>
                Select unit
              </option>
              {units.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Product Image
            </label>

            <label
              htmlFor="imageUpload"
              className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer hover:border-green-500 transition"
            >
              {!preview ? (
                <>
                  <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to upload product image
                  </p>
                </>
              ) : (
                <div className="relative w-40 h-40">
                  <Image
                    src={preview}
                    alt="Preview"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              )}

              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-xl flex items-center justify-center font-medium hover:bg-green-700 transition"
            disabled={loading}
          >
            {loading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              "Add Prodcut "
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddGrocery;
