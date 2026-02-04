"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { addToCart, decreaceQty, increaseQty } from "@/redux/cartSlice";

interface IGrocery {
  _id: string;
  name: string;
  category: string;
  price: string;
  unit: string;
  image: string;
  discount?: string;
}

const GroceryItemCard = ({ item }: { item: IGrocery }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { cartData } = useSelector((state: RootState) => state.cart);

  const cartItem = cartData.find((i) => i._id.toString() == item._id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ amount: 0.3 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.03 }}
      className="relative w-full max-w-[18rem] bg-white rounded-2xl p-4 sm:p-5 shadow-md hover:shadow-xl transition flex flex-col mx-auto"
    >
      {item.discount && (
        <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-red-500 text-white text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full">
          {item.discount} OFF
        </span>
      )}

      <div className="w-full h-28 sm:h-36 md:h-40 flex items-center justify-center mb-3 sm:mb-4">
        <img
          src={item.image}
          alt={item.name}
          className="object-contain h-full w-full"
        />
      </div>

      <div className="text-center mb-3 sm:mb-4">
        <p className="text-[10px] sm:text-xs uppercase tracking-wide text-gray-400">
          {item.category}
        </p>
        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 truncate">
          {item.name}
        </h3>
        <p className="text-base sm:text-lg md:text-xl font-bold text-green-600 mt-1">
          ₹{item.price}
          <span className="text-xs sm:text-sm text-gray-500">
            {" "}
            / {item.unit}
          </span>
        </p>
      </div>

      {/* Quantity Button */}
      <div className="h-[44px]">
        <AnimatePresence mode="wait">
          {!cartItem ? (
            <motion.button
              key="add"
              whileTap={{ scale: 0.95 }}
              onClick={() => dispatch(addToCart({ ...item, quantity: 1 }))}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full h-full rounded-xl font-semibold text-xs sm:text-sm bg-green-600 hover:bg-green-700 text-white shadow-md transition"
            >
              🛒 Add to Cart
            </motion.button>
          ) : (
            <motion.div
              key="qty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full h-full flex items-center justify-between rounded-xl bg-green-50 border border-green-200 overflow-hidden"
            >
              <button
                onClick={() => dispatch(decreaceQty(item._id))}
                className="w-10 h-full text-lg font-bold text-green-700 hover:bg-green-100 transition"
              >
                −
              </button>

              <span className="text-sm sm:text-base font-semibold text-green-700">
                {cartItem.quantity}
              </span>

              <button
                onClick={() => dispatch(increaseQty(item._id))}
                className="w-10 h-full text-lg font-bold text-green-700 hover:bg-green-100 transition"
              >
                +
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default GroceryItemCard;
