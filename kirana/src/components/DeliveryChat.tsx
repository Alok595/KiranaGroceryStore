"use client";

import { getSocekt } from "@/llib/socket";
import { IMessage } from "@/models/message.model";
import axios from "axios";
import mongoose from "mongoose";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, SendHorizonal } from "lucide-react";

type Props = {
  orderId: mongoose.Types.ObjectId;
  deliveryBoyId: mongoose.Types.ObjectId;
};

const DeliveryChat = ({ orderId, deliveryBoyId }: Props) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<any>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  /* ================= SOCKET ================= */
  useEffect(() => {
    const socket = getSocekt();
    socketRef.current = socket;

    socket.emit("join-room", orderId);

    // FIXED: Only listen for messages from OTHER users (not yourself)
    socket.on("send-message", (msg: IMessage) => {
      // Only add message if it's NOT from the delivery boy (to prevent duplicates)
      if (String(msg.senderId) !== String(deliveryBoyId)) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off("send-message");
      socket.emit("leave-room", orderId);
    };
  }, [orderId, deliveryBoyId]); // FIXED: Added deliveryBoyId to dependencies

  /* ================= HISTORY ================= */
  useEffect(() => {
    const getAllMessages = async () => {
      try {
        const result = await axios.post("/api/chat/messages", {
          roomId: orderId,
        });
        setMessages(result.data || []);
      } catch (error) {
        console.log(error);
      }
    };
    getAllMessages();
  }, [orderId]);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= SEND ================= */
  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const socket = socketRef.current;
    const message: Partial<IMessage> = {
      roomId: orderId,
      text: newMessage,
      senderId: deliveryBoyId,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // Add message to local state immediately (optimistic update)
    setMessages((prev) => [...prev, message as IMessage]);
    // Emit to server (other users will receive it)
    socket.emit("send-message", message);
    setNewMessage("");
    setSuggestions([]);
  };

  const getSuggestion = async () => {
    try {
      setIsLoadingSuggestions(true);
      const lastMessage = messages
        ?.filter((m) => String(m.senderId) !== String(deliveryBoyId))
        ?.at(-1);

      if (!lastMessage?.text) {
        console.log("No customer message to generate suggestions for");
        setIsLoadingSuggestions(false);
        return;
      }

      const result = await axios.post("/api/chat/ai-suggestions", {
        message: lastMessage?.text,
        role: "delivery_boy",
      });
      setSuggestions(result.data || []);
    } catch (error) {
      console.log(error);
      setSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between gap-3 border-b bg-white/80 backdrop-blur px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-semibold shadow">
            C
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-gray-900">Customer Chat</p>
            <p className="text-xs text-emerald-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </p>
          </div>
        </div>

        <button
          onClick={getSuggestion}
          disabled={isLoadingSuggestions}
          className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles
            size={14}
            className={isLoadingSuggestions ? "animate-spin" : ""}
          />
          {isLoadingSuggestions ? "Loading..." : "AI Reply"}
        </button>
      </div>

      {/* ================= MESSAGES ================= */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-gradient-to-b from-slate-50 to-slate-100">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => {
            const isMe = String(msg.senderId) === String(deliveryBoyId);

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.16 }}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow ${
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

      {/* ================= SUGGESTIONS ================= */}
      {suggestions.length > 0 && (
        <div className="border-t bg-slate-50 px-3 py-2 flex gap-2 overflow-x-auto scrollbar-hide">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => {
                setNewMessage(s);
                setSuggestions([]);
              }}
              className="whitespace-nowrap rounded-full border bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-emerald-50 hover:border-emerald-300 transition"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* ================= INPUT ================= */}
      <div className="border-t bg-white px-4 py-3 flex items-center gap-3">
        <input
          type="text"
          placeholder="Type your message…"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/40"
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          onClick={sendMessage}
          disabled={!newMessage.trim()}
          className="flex items-center gap-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SendHorizonal size={16} />
          Send
        </motion.button>
      </div>
    </div>
  );
};

export default DeliveryChat;
