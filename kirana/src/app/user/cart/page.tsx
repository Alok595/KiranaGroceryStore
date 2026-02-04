"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { decreaceQty, increaseQty, removeFromCart } from "@/redux/cartSlice";
import { useRouter } from "next/navigation";

const CartPage = () => {
  const { cartData, finalTotal, subTotal, deliveryFee } = useSelector(
    (state: RootState) => state.cart,
  );
  const dispatch = useDispatch<AppDispatch>();

  const router = useRouter();

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white px-4 sm:px-8 py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6 max-w-6xl mx-auto"
      >
        <Link
          href="/"
          className="p-2 rounded-full hover:bg-gray-100 transition"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">
          Shopping Cart
        </h1>
      </motion.div>

      <div className="max-w-6xl mx-auto">
        {cartData.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center"
          >
            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-4">
              <ShoppingCart className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-5 text-sm">
              Looks like you haven’t added anything yet
            </p>
            <Link
              href="/"
              className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md transition"
            >
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 space-y-4"
            >
              {cartData.map((item, i) => {
                const unitPrice = Number(item.price);
                const total = unitPrice * item.quantity;

                return (
                  <motion.div
                    key={i}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                    className="relative bg-white rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition flex gap-4 items-center"
                  >
                    {/* Trash Button */}
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      className="absolute top-3 right-3 p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                      title="Remove item"
                      onClick={() => dispatch(removeFromCart(item._id))}
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>

                    {/* Image */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border bg-gray-50"
                    />

                    {/* Details */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <h3 className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                        {item.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {item.category} · {item.unit}
                      </p>

                      {/* Price Math */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-xs sm:text-sm text-gray-500">
                          <span className="font-medium text-gray-700">
                            {item.quantity}-{item.unit}
                          </span>{" "}
                          × ₹{unitPrice}/{item.unit}
                        </div>

                        <div className="text-sm sm:text-base font-bold text-gray-900">
                          ₹{total}
                        </div>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center rounded-xl border border-green-200 bg-green-50 overflow-hidden shrink-0">
                      <button
                        className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-lg font-bold text-green-700 hover:bg-green-100 transition"
                        onClick={() => dispatch(decreaceQty(item._id))}
                      >
                        −
                      </button>
                      <span className="w-10 text-center text-sm sm:text-base font-semibold text-green-700">
                        {item.quantity}
                      </span>
                      <button
                        className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-lg font-bold text-green-700 hover:bg-green-100 transition"
                        onClick={() => dispatch(increaseQty(item._id))}
                      >
                        +
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 h-fit sticky top-24"
            >
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className="text-green-600 font-medium">
                    ₹{deliveryFee}
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between font-semibold text-gray-800">
                  <span>Total</span>
                  <span>₹{finalTotal}</span>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.96 }}
                className="mt-5 w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md transition"
                onClick={() => router.push("/user/chekout")}
              >
                Continue to Checkout →
              </motion.button>

              <p className="text-xs text-gray-400 text-center mt-3">
                Secure payments • Fast delivery
              </p>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
