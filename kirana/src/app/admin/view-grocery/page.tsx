"use client";
import { IGrocery } from "@/models/grocery.model";
import axios from "axios";
import {
  Pencil,
  Search,
  ArrowLeft,
  X,
  UploadCloud,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

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

const ViewGrocery = () => {
  const router = useRouter();
  const [groceries, setGroceries] = useState<IGrocery[]>();
  const [editing, setEditing] = useState<IGrocery | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [backendImage, setBackendImage] = useState<Blob | null>(null);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<IGrocery[]>();

  useEffect(() => {
    const getGrocery = async () => {
      try {
        const result = await axios.get("/api/admin/get-groceries");
        setGroceries(result.data);
        setFiltered(result.data);
      } catch (error) {
        console.log(error);
      }
    };
    getGrocery();
  }, []);

  useEffect(() => {
    if (editing) setImagePreview(editing.image);
  }, [editing]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setBackendImage(file);
      setImagePreview(preview);
    }
  };

  useEffect(() => {
    if (!groceries) return;

    const result = groceries.filter(
      (g) =>
        g.name.toLowerCase().includes(search.toLowerCase()) ||
        g.category.toLowerCase().includes(search.toLowerCase()),
    );

    setFiltered(result);
  }, [search, groceries]);

  const handleEdit = async () => {
    if (!editing) return;
    try {
      const formData = new FormData();
      formData.append("name", editing?.name);
      formData.append("groceryId", editing?._id?.toString()!);

      formData.append("category", editing?.category);
      formData.append("price", editing?.price);
      formData.append("unit", editing?.unit);

      if (backendImage) {
        formData.append("image", backendImage);
      }
      const result = await axios.post("/api/admin/edit-groceries", formData);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    if (!editing) return;
    try {
      const result = await axios.post("/api/admin/delete-grocery", {
        groceryId: editing._id,
      });
      // console.log(result);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* ================= Header ================= */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Groceries</h1>
            <p className="text-sm text-gray-500">
              Manage your product inventory
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search groceries..."
                className="w-full rounded-xl border bg-white pl-10 pr-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>

            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          </div>
        </div>

        {/* ================= Grocery Cards ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {filtered?.map((g, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10, scale: 1.03 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              className="relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition border"
            >
              {/* Image */}
              <div className="relative h-60 w-full overflow-hidden bg-gray-100">
                <Image
                  src={g.image}
                  alt={g.name}
                  fill
                  unoptimized
                  priority={i < 4}
                  className="object-cover"
                />

                {/* Category pill */}
                <div className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-700 shadow">
                  {g.category}
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 line-clamp-1">
                    {g.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">Product Name</p>
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <p className="text-xl font-extrabold text-emerald-700">
                    ₹{g.price}
                    <span className="ml-1 text-xs font-medium text-gray-500">
                      / {g.unit}
                    </span>
                  </p>

                  <button
                    onClick={() => setEditing(g)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow hover:bg-emerald-700 transition active:scale-95"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ================= Edit Modal ================= */}
      <AnimatePresence>
        {editing && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border p-6 sm:p-8"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Edit Grocery
                  </h2>
                  <p className="text-sm text-gray-500">
                    Update product information
                  </p>
                </div>

                <button
                  onClick={() => setEditing(null)}
                  className="rounded-full p-2 hover:bg-gray-100 transition"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {/* Image Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Product Image
                </label>

                <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 cursor-pointer hover:border-emerald-500 transition">
                  {!imagePreview ? (
                    <>
                      <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        Click to upload product image
                      </p>
                    </>
                  ) : (
                    <div className="relative w-40 h-40 rounded-xl overflow-hidden">
                      <Image
                        src={imagePreview}
                        alt={editing.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    id="imageUpload"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>

              {/* Form */}
              <div className="space-y-6">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={editing.name}
                    onChange={(e) =>
                      setEditing({ ...editing, name: e.target.value })
                    }
                    placeholder="Fresh Organic Apples"
                    className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none transition"
                  />
                </div>

                {/* Category & Price */}
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Category
                    </label>
                    <select
                      value={editing.category}
                      onChange={(e) =>
                        setEditing({ ...editing, category: e.target.value })
                      }
                      className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none transition"
                    >
                      <option value="" disabled>
                        Select category
                      </option>
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
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
                      value={editing.price}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          price: e.target.value,
                        })
                      }
                      placeholder="0.00"
                      className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none transition"
                    />
                  </div>
                </div>

                {/* Unit */}
                <div>
                  <label className="block text-sm font-medium mb-1">Unit</label>
                  <select
                    value={editing.unit}
                    onChange={(e) =>
                      setEditing({ ...editing, unit: e.target.value })
                    }
                    className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none transition"
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

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleEdit}
                    type="button"
                    className="flex-1 bg-emerald-600 text-white py-3 rounded-xl flex items-center justify-center font-semibold hover:bg-emerald-700 transition active:scale-[0.98]"
                  >
                    Save Changes
                  </button>

                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-600 hover:bg-red-100 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ViewGrocery;
