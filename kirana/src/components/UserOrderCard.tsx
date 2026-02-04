"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  MapPin,
  Package,
  ChevronDown,
  Truck,
  PhoneCall,
  UserCheck,
  TruckElectric,
  CheckCircle,
} from "lucide-react";
import { getSocekt } from "@/llib/socket";

import { IUser } from "@/models/user.model";
import { useRouter } from "next/navigation";

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

const UserOrderCard = ({ order }: { order: IOrder }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(order.status);

  const paymentStatus = order.isPaid ? "paid" : "unpaid";

  const paymentBadge = {
    paid: "bg-green-100 text-green-700",
    unpaid: "bg-red-100 text-red-600",
  };

  const statusBadge = {
    pending: "bg-yellow-100 text-yellow-700",
    "out of delivery": "bg-blue-100 text-blue-700",
    delivered: "bg-green-100 text-green-700",
  };

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

  /* ---------------- DELIVERED VIEW ONLY ---------------- */
  if (status === "delivered") {
    return (
      <div className="max-w-3xl w-full rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between bg-green-50 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Order{" "}
              <span className="text-green-700">
                #{order._id?.toString().slice(-6)}
              </span>
            </p>
            <p className="text-xs text-gray-500">
              {order.createdAt
                ? new Date(order.createdAt).toLocaleDateString()
                : ""}
            </p>
          </div>

          <span
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${statusBadge.delivered}`}
          >
            <CheckCircle className="h-4 w-4" /> Delivered
          </span>
        </div>

        <div className="px-4 py-3 space-y-2 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-green-600" />
            <span className="capitalize">{order.paymentMethod}</span>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-green-600 mt-0.5" />
            <p className="line-clamp-2">{order.address.fullAddress}</p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t bg-gray-50 px-4 py-3 text-sm">
          <p className="font-semibold text-gray-900">
            Total: ₹{order.totalAmount}
          </p>

          <button
            onClick={() => setOpen((p) => !p)}
            className="flex items-center gap-1 text-green-700 font-medium"
          >
            <Package className="h-4 w-4" />
            {open ? "Hide Items" : "View Items"}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t"
            >
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4 py-3 text-sm"
                >
                  <div className="h-10 w-10 rounded border bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Package className="h-4 w-4 text-gray-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.quantity} × pack
                    </p>
                  </div>

                  <p className="font-semibold">₹{item.price}</p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  /* ---------------- ACTIVE ORDER VIEW ---------------- */
  return (
    <div className="max-w-3xl w-full rounded-xl border bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-2 bg-green-50 px-4 py-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            Order{" "}
            <span className="text-green-700">
              #{order._id?.toString().slice(-6)}
            </span>
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {order.createdAt
              ? new Date(order.createdAt).toLocaleDateString() +
                " · " +
                new Date(order.createdAt).toLocaleTimeString()
              : ""}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
              paymentBadge[paymentStatus]
            }`}
          >
            {paymentStatus}
          </span>

          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
              statusBadge[status]
            }`}
          >
            {status}
          </span>
        </div>
      </div>

      {/* Meta */}
      <div className="px-4 py-3 space-y-2 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-green-600 shrink-0" />
          <span>{order.paymentMethod}</span>
        </div>

        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 text-green-600 shrink-0" />
          <p className="leading-snug line-clamp-2">
            {order.address.fullAddress}
          </p>
        </div>
      </div>

      {/* Assigned */}
      {order.assignedDeliveryBoy && (
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between gap-3 rounded-lg border bg-emerald-50 px-3 py-2">
            <div className="flex items-start gap-2 min-w-0">
              <UserCheck className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
              <div className="text-sm leading-tight min-w-0">
                <p className="font-medium text-emerald-800 truncate">
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
        </div>
      )}

      {/* Toggle */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between border-t px-4 py-2.5 text-sm font-medium text-green-700 hover:bg-green-50 transition"
      >
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          <span>{open ? "Hide Order Items" : "View Order Items"}</span>
        </div>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Items */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t"
          >
            {order.items.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3 text-sm"
              >
                <div className="h-10 w-10 rounded border bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={40}
                      height={40}
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
                    {item.quantity} × pack
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
        <div className="flex items-center gap-2 text-green-700 font-medium">
          <Truck className="h-4 w-4" />
          <span>
            Delivery: <span className="capitalize">{status}</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {order.assignedDeliveryBoy && (
            <button
              onClick={() =>
                router.push(`/user/trackOrder/${order._id?.toString()}`)
              }
              className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-semibold flex justify-center items-center gap-2 text-white hover:bg-green-700 transition"
            >
              <TruckElectric /> <span>Track Order</span>
            </button>
          )}

          <p className="font-semibold text-gray-900">
            Total:- ₹{order.totalAmount}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserOrderCard;
