"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  MapPin,
  Package,
  Truck,
  Loader,
  Lock,
  AlertCircle,
  DollarSign,
} from "lucide-react";
import { getSocekt } from "@/llib/socket";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import LiveMap from "./LiveMap";
import DeliveryChat from "./DeliveryChat";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ILocation {
  latitude: number;
  longitude: number;
}

const DeliveryBoyDashboard = ({ earning }: { earning: number }) => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useSelector((state: RootState) => state.user);

  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [sendOtpLoading, setSendOtpLoading] = useState(false);
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);

  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });

  const fetchAssignments = async () => {
    try {
      const result = await axios.get("/api/delivery/get-assignment");
      setAssignments(result.data.assignments || result.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect((): any => {
    const socket = getSocekt();
    socket.on("new-assignment", (deliveryAssignment) => {
      setAssignments((prev) => [...prev, deliveryAssignment]);
    });
    return () => socket.off("new-assignment");
  }, []);

  const handleAccept = async (id: string) => {
    try {
      await axios.get(`/api/delivery/assignment/${id}/accept-assignment`);
      fetchCurrentrOrder();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCurrentrOrder = async () => {
    try {
      const result = await axios.get("/api/delivery/current-order");
      if (result.data.active) {
        setActiveOrder(result.data.assignment);
        setUserLocation({
          latitude: result.data.assignment.order.address.latitude,
          longitude: result.data.assignment.order.address.longitude,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCurrentrOrder();
    fetchAssignments();
  }, [userData]);

  useEffect(() => {
    const socket = getSocekt();
    if (!userData?._id) return;
    if (!navigator.geolocation) return;

    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setDeliveryBoyLocation({
          latitude: lat,
          longitude: lon,
        });

        socket.emit("update-location", {
          userId: userData?._id,
          latitude: lat,
          longitude: lon,
        });
      },
      (err) => {
        console.log(err);
      },
      { enableHighAccuracy: true },
    );
    return () => navigator.geolocation.clearWatch(watcher);
  }, [userData?._id]);

  useEffect((): any => {
    const socket = getSocekt();
    socket.on("update-deliveryBoy-location", ({ userId, location }) => {
      setDeliveryBoyLocation({
        latitude: location.coordinates[1],
        longitude: location.coordinates[0],
      });
    });
    return () => socket.off("update-deliveryBoy-location");
  }, []);

  const sendOtp = async () => {
    setSendOtpLoading(true);
    setOtpError("");
    try {
      await axios.post("/api/delivery/otp/send", {
        orderId: activeOrder.order._id,
      });
      setShowOtpBox(true);
    } catch (error) {
      console.log(error);
    } finally {
      setSendOtpLoading(false);
    }
  };

  const verifyOtp = async () => {
    setVerifyOtpLoading(true);
    setOtpError("");
    try {
      await axios.post("/api/delivery/otp/verify", {
        orderId: activeOrder.order._id,
        otp,
      });
      setActiveOrder(null);
      setShowOtpBox(false);
      setOtp("");
      await fetchCurrentrOrder();
      window.location.reload();
    } catch (error) {
      setOtpError("Invalid OTP. Please try again.");
    } finally {
      setVerifyOtpLoading(false);
    }
  };

  /* ================= EMPTY DASHBOARD + CHART ================= */
  if (!activeOrder && assignments.length === 0 && !loading) {
    const todayEarning = [
      {
        name: "Today",
        earning,
        deliveries: Math.floor(earning / 40),
      },
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white shadow">
              <DollarSign className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Today&apos;s Performance
            </h2>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl bg-white border shadow-sm p-5">
              <p className="text-sm text-gray-500">Total Earnings</p>
              <p className="text-3xl font-bold text-emerald-600 mt-1">
                ₹{earning || 0}
              </p>
            </div>
            <div className="rounded-xl bg-white border shadow-sm p-5">
              <p className="text-sm text-gray-500">Deliveries Completed</p>
              <p className="text-3xl font-bold text-indigo-600 mt-1">
                {Math.floor(earning / 40)}
              </p>
            </div>
          </div>

          {/* Chart */}
          {/* Earnings Line Chart */}
          <div className="rounded-xl bg-white border shadow-sm p-6 h-[340px]">
            <h3 className="text-base font-semibold text-gray-800 mb-4">
              Today’s Earnings Trend
            </h3>

            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[
                  { time: "9 AM", earning: 80 },
                  { time: "11 AM", earning: 160 },
                  { time: "1 PM", earning: 240 },
                  { time: "3 PM", earning: 320 },
                  { time: "5 PM", earning: earning || 0 },
                ]}
                margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip formatter={(v) => [`₹${v}`, "Earnings"]} />
                <Line
                  type="monotone"
                  dataKey="earning"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 7 }}
                  animationDuration={900}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* No Assignments */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border bg-white py-14 text-center text-gray-500 shadow-sm"
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
              <Package className="h-6 w-6" />
            </div>
            No assignments available 🚚
          </motion.div>
        </div>
      </div>
    );
  }

  /* ================= ACTIVE DELIVERY VIEW ================= */
  if (activeOrder && userLocation) {
    return (
      <div className="bg-slate-100 p-4 sm:p-6">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
          {/* LEFT — MAP CARD */}
          <div className="rounded-xl bg-white border shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white">
                <Truck className="h-4 w-4" />
              </div>
              <div>
                <h1 className="text-base font-semibold text-gray-900">
                  Active Delivery
                </h1>
                <p className="text-xs text-gray-500">
                  Order #{activeOrder.order._id.slice(-6)}
                </p>
              </div>
            </div>

            <div className="h-[320px] sm:h-[380px] md:h-[440px]">
              <LiveMap
                userLocation={userLocation}
                deliveryBoyLocation={deliveryBoyLocation}
              />
            </div>

            <div className="border-t px-4 py-3 text-sm bg-slate-50 text-gray-700">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="font-medium">Delivery Address</span>
              </div>
              <p className="mt-1 text-gray-600">
                {activeOrder.order.address.fullAddress}
              </p>
            </div>
          </div>

          {/* RIGHT — CHAT */}
          <div className="rounded-xl bg-white border shadow-sm overflow-hidden flex flex-col h-[320px] sm:h-[380px] md:h-[540px]">
            <DeliveryChat
              orderId={activeOrder.order._id}
              deliveryBoyId={userData?._id!}
            />
          </div>

          {/* OTP SECTION */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {!activeOrder.order.deliveryOtpVerification && !showOtpBox && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="rounded-xl bg-white border shadow-sm p-6"
                >
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                        <Lock className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">
                          Complete Delivery
                        </h3>
                        <p className="text-sm text-gray-500">
                          Send OTP to customer for verification
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={sendOtp}
                      disabled={sendOtpLoading}
                      className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed min-w-[180px] justify-center"
                    >
                      {sendOtpLoading ? (
                        <>
                          <Loader className="h-4 w-4 animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          <span>Mark As Delivered</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {showOtpBox && !activeOrder.order.deliveryOtpVerification && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-xl bg-white border shadow-lg p-6 sm:p-8"
                >
                  <div className="max-w-md mx-auto">
                    <div className="text-center mb-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600"
                      >
                        <Lock className="h-8 w-8" />
                      </motion.div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Enter OTP
                      </h3>
                      <p className="mt-2 text-sm text-gray-500">
                        OTP has been sent to the customer
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="otp"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          4-Digit OTP
                        </label>
                        <motion.input
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          id="otp"
                          type="text"
                          placeholder="Enter 4-digit OTP"
                          maxLength={4}
                          value={otp}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            setOtp(value);
                            setOtpError("");
                          }}
                          className="w-full px-4 py-3 text-center text-2xl font-bold tracking-widest border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                        />
                      </div>

                      <AnimatePresence>
                        {otpError && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
                          >
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <span>{otpError}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="flex gap-3 pt-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={verifyOtp}
                          disabled={verifyOtpLoading || otp.length !== 4}
                          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {verifyOtpLoading ? (
                            <>
                              <Loader className="h-4 w-4 animate-spin" />
                              <span>Verifying...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4" />
                              <span>Verify OTP</span>
                            </>
                          )}
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setShowOtpBox(false);
                            setOtp("");
                            setOtpError("");
                          }}
                          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
                        >
                          Cancel
                        </motion.button>
                      </div>

                      <div className="text-center pt-2">
                        <button
                          onClick={sendOtp}
                          disabled={sendOtpLoading}
                          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium disabled:opacity-50"
                        >
                          Resend OTP
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeOrder.order.deliveryOtpVerification && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 border shadow-lg p-6 text-white text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.6, delay: 0.1 }}
                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-emerald-600"
                  >
                    <CheckCircle className="h-8 w-8" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-2">
                    Delivery Completed!
                  </h3>
                  <p className="text-emerald-100">
                    Order has been successfully delivered and verified
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }

  /* ================= ASSIGNMENT LIST VIEW ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white shadow">
            <Package className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Delivery Assignments
          </h2>
        </motion.div>

        {loading && (
          <div className="flex justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="h-10 w-10 rounded-full border-4 border-indigo-500 border-t-transparent"
            />
          </div>
        )}

        {!loading && assignments.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border bg-white py-16 text-center text-gray-500 shadow-sm"
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
              <Package className="h-6 w-6" />
            </div>
            No assignments available 🚚
          </motion.div>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {assignments.map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -6 }}
              className="group rounded-2xl border bg-white shadow-md hover:shadow-lg transition p-5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-indigo-600">
                    Order #{a?.order?._id?.slice(-6)}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-medium">
                    New
                  </span>
                </div>

                <div className="flex items-start gap-2 text-gray-700 text-sm leading-snug">
                  <MapPin className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
                  <p className="line-clamp-2">
                    {a?.order?.address?.fullAddress}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => handleAccept(a._id!)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 text-white py-2.5 text-sm font-semibold hover:bg-emerald-700 transition shadow-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  Accept
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-50 text-red-600 py-2.5 text-sm font-semibold hover:bg-red-100 transition border border-red-100">
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeliveryBoyDashboard;
