"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, ShoppingBag, Package } from "lucide-react";
import Link from "next/link";

const OrderSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 via-white to-green-100 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white max-w-md w-full rounded-3xl shadow-lg border p-8 text-center space-y-6"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 12 }}
          className="flex justify-center"
        >
          <CheckCircle className="w-20 h-20 text-green-600" />
        </motion.div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-800">
            Order Placed Successfully 🎉
          </h1>
          <p className="text-sm text-gray-600">
            Thank you for your order! Your groceries will be delivered soon.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 pt-3">
          <Link
            href="/user/my-orders"
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow transition"
          >
            <Package className="w-4 h-4" />
            View My Orders
          </Link>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold transition"
          >
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
