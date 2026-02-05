"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  CalendarDays,
  Wallet,
  Package,
  Users,
  Truck,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
type StatItem = {
  title: string;
  value: number;
};
type propType = {
  earning: {
    today: number;
    sevenDays: number;
    total: number;
  };
  stats: StatItem[];

  chartData: {
    day: string;
    orders: number;
  }[];
};

const AdminDashBoardClient = ({ earning, stats, chartData }: propType) => {
  const [filter, setFilter] = useState<"today" | "sevenDays" | "total">(
    "sevenDays",
  );

  const currentEarning =
    filter === "today"
      ? earning.today
      : filter === "sevenDays"
        ? earning.sevenDays
        : earning.total;

  const title =
    filter === "today"
      ? "Today's Earnings"
      : filter === "sevenDays"
        ? "Last 7 Days Earnings"
        : "Total Earnings";

  const getStatIcon = (title: string) => {
    if (title.toLowerCase().includes("order")) return Package;
    if (title.toLowerCase().includes("customer")) return Users;
    if (title.toLowerCase().includes("pending")) return Truck;
    return TrendingUp;
  };

  const getStatValue = (value: number) => value;

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-7xl rounded-2xl bg-white/80 backdrop-blur-xl border shadow-lg p-6 sm:p-8"
      >
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-500">
              Track your business performance
            </p>
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          >
            <option value="sevenDays">Last 7 Days</option>
            <option value="today">Today</option>
            <option value="total">Total</option>
          </select>
        </div>

        {/* Earnings Cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
          <motion.div
            whileHover={{ scale: 1.04, y: -2 }}
            className={`rounded-xl border p-5 shadow-sm transition ${
              filter === "today"
                ? "bg-emerald-50 border-emerald-300"
                : "bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">Today</p>
              <CalendarDays className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="mt-3 text-2xl font-bold text-gray-900">
              ₹{earning.today.toLocaleString()}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.04, y: -2 }}
            className={`rounded-xl border p-5 shadow-sm transition ${
              filter === "sevenDays"
                ? "bg-indigo-50 border-indigo-300"
                : "bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">Last 7 Days</p>
              <TrendingUp className="h-5 w-5 text-indigo-600" />
            </div>
            <p className="mt-3 text-2xl font-bold text-gray-900">
              ₹{earning.sevenDays.toLocaleString()}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.04, y: -2 }}
            className={`rounded-xl border p-5 shadow-sm transition ${
              filter === "total" ? "bg-amber-50 border-amber-300" : "bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">Total</p>
              <Wallet className="h-5 w-5 text-amber-600" />
            </div>
            <p className="mt-3 text-2xl font-bold text-gray-900">
              ₹{earning.total.toLocaleString()}
            </p>
          </motion.div>
        </div>

        {/* Highlight Card */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-500 p-6 sm:p-8 text-white shadow-lg"
            >
              <div className="relative z-10">
                <p className="text-sm font-medium opacity-90">{title}</p>
                <p className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">
                  ₹{currentEarning.toLocaleString()}
                </p>
                <p className="mt-1 text-xs opacity-80">Updated in real time</p>
              </div>

              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
              <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-black/10 blur-2xl" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Stats Section */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-5">
          {stats.map((stat, i) => {
            const Icon = getStatIcon(stat.title);
            const value = getStatValue(stat.value);

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.04, y: -2 }}
                className="group relative overflow-hidden rounded-xl border bg-white p-5 shadow-sm transition"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </p>
                  <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600 group-hover:bg-emerald-100 transition">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <p className="mt-3 text-3xl font-extrabold text-gray-900">
                  {value.toLocaleString()}
                </p>

                <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-emerald-100/40 blur-2xl" />
              </motion.div>
            );
          })}
        </div>

        {/* Orders Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-10 rounded-2xl border bg-white p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Orders Overview
              </h2>
              <p className="text-sm text-gray-500">Last 7 days performance</p>
            </div>
            <TrendingUp className="h-5 w-5 text-emerald-600" />
          </div>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminDashBoardClient;
