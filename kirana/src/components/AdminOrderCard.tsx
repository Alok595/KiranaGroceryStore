"use client";

import React, { useEffect, useState } from "react";
import {
  Package,
  Phone,
  MapPin,
  CreditCard,
  ChevronDown,
  UserCheck,
  PhoneCall,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import axios from "axios";

import { IUser } from "@/models/user.model";
import { getSocekt } from "@/llib/socket";

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

const statusBadge = {
  pending: "bg-yellow-100 text-yellow-700",
  "out of delivery": "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
};

interface Props {
  order: IOrder;
  onStatusChange?: (id: string, status: "pending" | "out of delivery") => void;
}

const AdminOrderCard: React.FC<Props> = ({ order, onStatusChange }) => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<IOrder["status"]>(order.status);

  const updateStatus = async (orderId: string, newStatus: IOrder["status"]) => {
    try {
      await axios.post(`/api/admin/update-order-status/${orderId}`, {
        status: newStatus,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setStatus(order.status);
  }, [order.status]);
  useEffect(() => {
    const socket = getSocekt();
    socket.on("order-status-update", (data) => {
      if (data.orderId.toString() === order?._id!.toString()) {
        setStatus(data.status);
      }
    });
    return () => {
      socket.off("order-status-update");
    };
  }, [order?._id]);
  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
      {/* Top */}
      <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-start lg:justify-between">
        {/* Left */}
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Package className="h-4 w-4 text-emerald-600 shrink-0" />
            <p className="font-semibold text-emerald-700 truncate">
              Order #{order._id?.toString().slice(-6)}
            </p>

            {/* Paid / Unpaid badge (hidden when delivered) */}
            {status !== "delivered" && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  order.isPaid
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {order.isPaid ? "Paid" : "Unpaid"}
              </span>
            )}
          </div>

          <p className="text-xs text-gray-500">
            {order.createdAt &&
              `${new Date(order.createdAt).toLocaleDateString()} · ${new Date(
                order.createdAt,
              ).toLocaleTimeString()}`}
          </p>

          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Package className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="truncate">{order.address?.fullname}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Phone className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{order.address?.mobile}</span>
          </div>

          <div className="flex items-start gap-2 text-sm text-gray-700">
            <MapPin className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
            <span className="line-clamp-2">{order.address?.fullAddress}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-700">
            <CreditCard className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>
              {order.paymentMethod === "cod"
                ? "Cash on Delivery"
                : "Online Payment"}
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-3 w-full lg:w-auto lg:items-end">
          {/* Assigned */}
          {order.assignedDeliveryBoy && (
            <div className="flex items-center justify-between gap-3 rounded-lg border bg-emerald-50 px-3 py-2 w-full sm:min-w-[220px]">
              <div className="flex items-start gap-2">
                <UserCheck className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                <div className="text-sm leading-tight">
                  <p className="font-medium text-emerald-800 truncate max-w-[140px]">
                    {order.assignedDeliveryBoy.name}
                  </p>
                  <p className="flex items-center gap-1 text-emerald-700">
                    <PhoneCall className="h-4 w-4 shrink-0" />
                    +91 {order.assignedDeliveryBoy.mobile}
                  </p>
                </div>
              </div>

              <a
                href={`tel:${order.assignedDeliveryBoy.mobile}`}
                className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition shrink-0"
              >
                Call
              </a>
            </div>
          )}

          {/* Status badge + select (select hidden when delivered) */}
          <div className="flex items-center justify-between gap-2 lg:flex-col lg:items-end w-full lg:w-auto">
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                statusBadge[status]
              }`}
            >
              {status}
            </span>

            {status !== "delivered" && (
              <select
                value={status}
                onChange={(e) => {
                  const val = e.target.value as "pending" | "out of delivery";
                  setStatus(val);
                  updateStatus(order._id?.toString()!, val);
                  onStatusChange?.(order._id?.toString() || "", val);
                }}
                className="rounded-lg border px-3 py-1.5 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full lg:w-auto"
              >
                <option value="pending">PENDING</option>
                <option value="out of delivery">OUT OF DELIVERY</option>
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Toggle */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center justify-between border-t px-4 py-2.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50 transition"
      >
        <span>View {order.items?.length || 0} Items</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Items */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t"
          >
            {order.items?.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 px-4 py-3 text-sm"
              >
                <div className="h-10 w-10 rounded border bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={String(item.name)}
                      width={40}
                      height={40}
                      unoptimized
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Package className="h-4 w-4 text-gray-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.quantity} × {item.unit}
                  </p>
                </div>

                <p className="font-semibold text-gray-900 shrink-0">
                  ₹{item.price}
                </p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="flex items-center justify-between border-t bg-gray-50 px-4 py-2.5 text-sm">
        <p className="text-emerald-700 font-medium capitalize">
          Delivery: {status}
        </p>
        <p className="font-semibold text-gray-900">
          Total: ₹{order.totalAmount}
        </p>
      </div>
    </div>
  );
};

export default AdminOrderCard;
