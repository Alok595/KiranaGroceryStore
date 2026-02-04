"use client";

import LiveMap from "@/components/LiveMap";
import { getSocekt } from "@/llib/socket";
import { IMessage } from "@/models/message.model";
import { IUser } from "@/models/user.model";
import { RootState } from "@/redux/store";
import axios from "axios";
import { ArrowLeft, MapPin, Truck } from "lucide-react";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

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

interface ILocation {
  latitude: number;
  longitude: number;
}

const TrackOrder = () => {
  const { orderId } = useParams();
  const { userData } = useSelector((state: RootState) => state.user);
  const router = useRouter();

  const [order, setOrder] = useState<IOrder>();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<any>(null);
  const messageIdsRef = useRef<Set<string>>(new Set()); // Track message IDs

  const [userLocation, setUserLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });

  /* ================= CHAT SOCKET ================= */
  useEffect(() => {
    if (!orderId || !userData?._id) return;

    const socket = getSocekt();
    socketRef.current = socket;

    socket.emit("join-room", orderId);

    // FIXED: Deduplicate messages using unique ID
    socket.on("send-message", (msg: IMessage) => {
      // Create a unique ID for this message
      const messageId = `${msg.senderId}-${msg.text}-${msg.time}`;

      // Only add if we haven't seen this message before
      if (!messageIdsRef.current.has(messageId)) {
        messageIdsRef.current.add(messageId);
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off("send-message");
      socket.emit("leave-room", orderId);
    };
  }, [orderId, userData?._id]);

  /* ================= CHAT HISTORY ================= */
  useEffect(() => {
    const getAllMessages = async () => {
      try {
        const result = await axios.post("/api/chat/messages", {
          roomId: orderId,
        });
        const historyMessages = result.data || [];

        // Add history message IDs to the set
        historyMessages.forEach((msg: IMessage) => {
          const messageId = `${msg.senderId}-${msg.text}-${msg.time}`;
          messageIdsRef.current.add(messageId);
        });

        setMessages(historyMessages);
      } catch (error) {
        console.log(error);
      }
    };
    if (orderId) getAllMessages();
  }, [orderId]);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= SEND ================= */
  const sendMessage = () => {
    if (!newMessage.trim() || !userData?._id) return;

    const socket = socketRef.current;
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const message: Partial<IMessage> = {
      roomId: orderId as any,
      text: newMessage,
      senderId: userData._id,
      time: time,
    };

    // Create unique ID and add to tracking set
    const messageId = `${userData._id}-${newMessage}-${time}`;
    messageIdsRef.current.add(messageId);

    // Add message to local state immediately (optimistic update)
    setMessages((prev) => [...prev, message as IMessage]);
    // Emit to server
    socket.emit("send-message", message);
    setNewMessage("");
  };

  /* ================= ORDER DATA ================= */
  useEffect(() => {
    const getOrder = async () => {
      try {
        const result = await axios.get(`/api/user/get-order/${orderId}`);
        setOrder(result.data);

        setUserLocation({
          latitude: result.data.address.latitude,
          longitude: result.data.address.longitude,
        });

        setDeliveryBoyLocation({
          latitude: result.data.assignedDeliveryBoy.location.coordinates[1],
          longitude: result.data.assignedDeliveryBoy.location.coordinates[0],
        });
      } catch (error) {
        console.log(error);
      }
    };
    if (orderId) getOrder();
  }, [orderId]);

  /* ================= LIVE LOCATION SOCKET ================= */
  useEffect(() => {
    const socket = getSocekt();

    socket.on("update-deliveryBoy-location", (data) => {
      setDeliveryBoyLocation({
        latitude: data.location.coordinates?.[1] ?? data.location.latitude,
        longitude: data.location.coordinates?.[0] ?? data.location.longitude,
      });
    });

    return () => {
      socket.off("update-deliveryBoy-location");
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="mx-auto max-w-6xl space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="rounded-full border bg-white p-2 shadow-sm hover:bg-gray-100 transition"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">Track Order</h2>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              Order #{order?._id?.toString().slice(-6)}
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                  order?.status === "delivered"
                    ? "bg-green-100 text-green-700"
                    : order?.status === "out of delivery"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order?.status}
              </span>
            </p>
          </div>
        </div>

        {/* Map Card */}
        <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 border-b px-4 py-3">
            <Truck className="h-4 w-4 text-green-600" />
            <p className="text-sm font-semibold text-gray-800">
              Live Delivery Tracking
            </p>
          </div>

          <div className="h-87.5 sm:h-105 md:h-125">
            <LiveMap
              userLocation={userLocation}
              deliveryBoyLocation={deliveryBoyLocation}
            />
          </div>
        </div>

        {/* CHAT */}
        <div className="h-105 flex flex-col bg-white rounded-xl overflow-hidden border shadow-sm">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b bg-slate-50">
            <div className="w-9 h-9 rounded-full bg-slate-300" />
            <div className="leading-tight">
              <p className="text-sm font-semibold text-gray-800">
                Delivery Partner Chat
              </p>
              <p className="text-xs text-emerald-600">Online</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-slate-100">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => {
                const isMe = String(msg.senderId) === String(userData?._id);

                return (
                  <motion.div
                    key={`${msg.senderId}-${msg.time}-${i}`}
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.18 }}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[78%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                        isMe
                          ? "bg-emerald-600 text-white rounded-br-md"
                          : "bg-white text-gray-800 rounded-bl-md border"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <p
                        className={`mt-1 text-[10px] text-right ${
                          isMe ? "text-emerald-100" : "text-gray-400"
                        }`}
                      >
                        {msg.time}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t bg-white px-3 py-2 flex items-center gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={sendMessage}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow hover:bg-emerald-700 transition"
            >
              Send
            </motion.button>
          </div>
        </div>

        {/* Delivery Info */}
        {order && (
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Address */}
            <div className="rounded-xl border bg-white p-4 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-green-700 font-medium">
                <MapPin className="h-4 w-4" />
                <span>Delivery Address</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {order.address.fullAddress}
              </p>
              <p className="text-xs text-gray-500">
                {order.address.city}, {order.address.state} —{" "}
                {order.address.pincode}
              </p>
            </div>

            {/* Order Summary */}
            <div className="rounded-xl border bg-white p-4 shadow-sm space-y-2">
              <p className="text-sm font-medium text-gray-800">Order Summary</p>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Items</span>
                <span>{order.items.length}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Payment</span>
                <span className="uppercase">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between border-t pt-2 text-sm font-semibold text-gray-900">
                <span>Total</span>
                <span>₹{order.totalAmount}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
