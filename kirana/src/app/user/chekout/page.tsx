"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  User,
  Phone,
  Home,
  CreditCard,
  Banknote,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import axios from "axios";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
const ChekoutMap = dynamic(() => import("@/components/ChekoutMap"), {
  ssr: false,
});

/* ---------------- TYPES ---------------- */
type AddressState = {
  fullName: string;
  mobile: string;
  city: string;
  state: string;
  pincode: string;
  fullAddress: string;
};

const CheckoutPage = () => {
  const { userData } = useSelector((state: RootState) => state.user);
  const { finalTotal, deliveryFee, subTotal, cartData } = useSelector(
    (state: RootState) => state.cart,
  );

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");

  const [address, setAddress] = useState<AddressState>({
    fullName: "",
    mobile: "",
    city: "",
    state: "",
    pincode: "",
    fullAddress: "",
  });

  const router = useRouter();

  const [position, setPosition] = useState<[number, number] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  /* ---------------- PREFILL USER DATA ---------------- */
  useEffect(() => {
    if (!userData) return;
    setAddress((prev) => ({
      ...prev,
      fullName: userData.name || "",
      mobile: userData.mobile || "",
    }));
  }, [userData]);

  /* ---------------- CURRENT LOCATION ---------------- */
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => console.error("Location error:", err),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  useEffect(() => {
    handleCurrentLocation();
  }, []);

  /* ---------------- REVERSE GEOCODE ---------------- */
  const reverseGeocode = async (lat: number, lon: number) => {
    try {
      const { data } = await axios.get(
        `/api/reverse-geocode?lat=${lat}&lon=${lon}`,
      );

      const addr = data.address || {};

      setAddress((prev) => ({
        ...prev,
        city: addr.city || addr.town || addr.village || addr.county || "",
        state: addr.state || "",
        pincode: addr.postcode || "",
        fullAddress: data.display_name || "",
      }));
    } catch (error) {
      console.error("Reverse geocode failed:", error);
    }
  };

  /* ---------------- AUTO UPDATE WHEN POSITION CHANGES ---------------- */
  useEffect(() => {
    if (!position) return;
    reverseGeocode(position[0], position[1]);
  }, [position]);

  /* ---------------- SEARCH ---------------- */
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const { data } = await axios.get(
        `/api/forward-geocode?q=${encodeURIComponent(searchQuery)}`,
      );
      setSearchResults(data || []);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  const handleSelectSearchResult = (item: any) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    setSearchResults([]);
    setSearchQuery(item.display_name);
    setPosition([lat, lon]);
  };

  /* ---------------- PLACE ORDER ---------------- */
  const handleCod = async () => {
    if (!position) return;

    try {
      await axios.post("/api/user/order", {
        userId: userData?._id,
        items: cartData.map((item) => ({
          grocery: item._id,
          name: item.name,
          price: item.price,
          unit: item.unit,
          quantity: item.quantity,
          image: item.image,
        })),
        totalAmount: finalTotal,
        address: {
          fullname: address.fullName,
          mobile: address.mobile,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          fullAddress: address.fullAddress,
          latitude: position[0],
          longitude: position[1],
        },
        paymentMethod,
      });

      router.push("/user/order-success");
    } catch (error) {
      console.error(error);
    }
  };

  const handleOnlineOrder = async () => {
    if (!position) return;

    try {
      const result = await axios.post("/api/user/payment", {
        userId: userData?._id,
        items: cartData.map((item) => ({
          grocery: item._id,
          name: item.name,
          price: item.price,
          unit: item.unit,
          quantity: item.quantity,
          image: item.image,
        })),
        totalAmount: finalTotal,
        address: {
          fullname: address.fullName,
          mobile: address.mobile,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          fullAddress: address.fullAddress,
          latitude: position[0],
          longitude: position[1],
        },
        paymentMethod,
      });

      window.location.href = result.data.url;
    } catch (error) {
      console.error(error);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-linear-to-br from-green-50/40 via-white to-green-50/60 px-4 sm:px-8 py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto flex items-center gap-3 mb-6"
      >
        <Link
          href="/user/cart"
          className="flex items-center gap-2 text-sm font-medium text-green-700 hover:text-green-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </Link>
        <h1 className="flex-1 text-center text-xl sm:text-2xl font-bold text-green-700 tracking-tight">
          Checkout
        </h1>
      </motion.div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-6">
        {/* LEFT — DELIVERY */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-3xl shadow-sm border p-5 sm:p-6 space-y-5"
        >
          <h2 className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-800">
            <MapPin className="w-4 h-4 text-green-600" />
            Delivery Address
          </h2>

          {/* Inputs */}
          <div className="space-y-3">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
              <input
                type="text"
                placeholder="Full Name"
                value={address.fullName}
                onChange={(e) =>
                  setAddress({ ...address, fullName: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-black border-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none text-sm"
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
              <input
                placeholder="Phone Number"
                value={address.mobile}
                onChange={(e) =>
                  setAddress({ ...address, mobile: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none text-sm"
              />
            </div>

            <div className="relative">
              <Home className="absolute left-3 top-3 w-4 h-4 text-green-600" />
              <textarea
                rows={2}
                placeholder="Full Address"
                value={address.fullAddress}
                onChange={(e) =>
                  setAddress({ ...address, fullAddress: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none text-sm resize-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <input
                placeholder="City"
                value={address.city}
                onChange={(e) =>
                  setAddress({ ...address, city: e.target.value })
                }
                className="px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none text-sm"
              />
              <input
                placeholder="State"
                value={address.state}
                onChange={(e) =>
                  setAddress({ ...address, state: e.target.value })
                }
                className="px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none text-sm"
              />
              <input
                placeholder="Pincode"
                value={address.pincode}
                onChange={(e) =>
                  setAddress({ ...address, pincode: e.target.value })
                }
                className="px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none text-sm"
              />
            </div>

            {/* Search */}
            <div className="relative">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search city or area..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none text-sm"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="px-5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition"
                >
                  Search
                </button>
              </div>

              {searchResults.length > 0 && (
                <div className="absolute z-50 mt-2 w-full bg-white border rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  {searchResults.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectSearchResult(item)}
                      className="w-full text-left px-4 py-2 hover:bg-green-50 text-sm"
                    >
                      {item.display_name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* MAP */}
          {position && (
            <div className="pt-4">
              <ChekoutMap position={position} setPosition={setPosition} />
            </div>
          )}
        </motion.div>

        {/* RIGHT — PAYMENT */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* Payment Method */}
          <div className="bg-white rounded-3xl shadow-sm border p-5 sm:p-6 space-y-4">
            <h2 className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-800">
              <CreditCard className="w-4 h-4 text-green-600" />
              Payment Method
            </h2>

            <div className="space-y-3">
              {/* ONLINE */}
              <button
                onClick={() => setPaymentMethod("online")}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition ${
                  paymentMethod === "online"
                    ? "border-green-600 bg-green-50 text-green-700 shadow-sm"
                    : "border-gray-200 hover:border-green-400 hover:bg-green-50/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4" />
                  Pay Online (Stripe)
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    paymentMethod === "online"
                      ? "border-green-600 bg-green-600"
                      : "border-gray-300"
                  }`}
                />
              </button>

              {/* COD */}
              <button
                onClick={() => setPaymentMethod("cod")}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition ${
                  paymentMethod === "cod"
                    ? "border-green-600 bg-green-50 text-green-700 shadow-sm"
                    : "border-gray-200 hover:border-green-400 hover:bg-green-50/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Banknote className="w-4 h-4" />
                  Cash on Delivery
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    paymentMethod === "cod"
                      ? "border-green-600 bg-green-600"
                      : "border-gray-300"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-3xl shadow-sm border p-5 sm:p-6 space-y-4 sticky top-24">
            <h2 className="text-sm sm:text-base font-semibold text-gray-800">
              Order Summary
            </h2>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="text-green-600 font-medium">
                  ₹{deliveryFee}
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between font-semibold text-gray-900">
                <span>Total</span>
                <span>₹{finalTotal}</span>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.96 }}
              className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md transition"
              onClick={() => {
                if (paymentMethod === "cod") {
                  handleCod();
                } else {
                  handleOnlineOrder();
                }
              }}
            >
              {paymentMethod === "cod" ? "Place Order" : "Pay And Place Order"}
            </motion.button>

            <p className="text-xs text-gray-400 text-center">
              Secure checkout • Fast delivery
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutPage;
