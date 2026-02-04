"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Package,
  Phone,
  MapPin,
  CreditCard,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import AdminOrderCard from "@/components/AdminOrderCard";
import { getSocekt } from "@/llib/socket";

import { IUser } from "@/models/user.model";

const statusBadge: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};
interface IOrder {
  _id?: string;
  user: string;
  items: [
    {
      grocery: string;
      name: string;
      price: string;
      unit: string;
      image: string;
      quantity: number;
    },
  ];
  totalAmount: number;
  paymentMethod: "cod" | "online";
  address: {
    fullname: string;
    mobile: string;
    city: string;
    state: string;
    pincode: string;
    fullAddress: string;
    latitude: number;
    longitude: number;
  };
  assignment?: string;
  assignedDeliveryBoy?: IUser;
  isPaid: boolean;
  status: "pending" | "out of delivery" | "delivered";
  createdAt?: Date;
  updatedAt?: Date;
}

const ManageOrders = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const result = await axios.get("/api/admin/get-orders");
        setOrders(result.data || []);
        console.log(result);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getOrders();
  }, []);

  useEffect(() => {
    const socket = getSocekt();

    socket.on("new-order", (newOrder) => {
      console.log("New order received:", newOrder);
      setOrders((prev) => [newOrder, ...prev!]);
    });

    socket.on("order-assigned", ({ orderId, assignedDeliveryBoy }) => {
      console.log("Order assigned event:", { orderId, assignedDeliveryBoy });

      setOrders((prev) =>
        prev?.map((o) => {
          const isMatch = o._id?.toString() === orderId.toString();
          return isMatch ? { ...o, assignedDeliveryBoy } : o;
        }),
      );
    });

    return () => {
      socket.off("new-order");
      socket.off("order-assigned");
    };
  }, []);
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="h-12 w-12 border-4 border-emerald-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white border-b px-5 py-3 flex items-center gap-3 shadow-sm">
        <button
          onClick={() => history.back()}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4 text-gray-700" />
        </button>
        <h1 className="text-base font-semibold text-gray-900">Manage Orders</h1>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-5 space-y-4">
        {orders.map((order, index) => (
          <AdminOrderCard
            key={index}
            order={order}
            onStatusChange={(id, status) => console.log(id, status)}
          />
        ))}
      </div>
    </div>
  );
};

export default ManageOrders;
