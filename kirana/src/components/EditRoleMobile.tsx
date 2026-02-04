"use client";

import axios from "axios";
import { motion } from "framer-motion";
import { User, ShieldCheck, Bike } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

export default function EditRoleMobile() {
  const [roles, setRoles] = useState([
    { id: "admin", label: "Admin", icon: ShieldCheck },
    { id: "user", label: "User", icon: User },
    { id: "deliveryboy", label: "Delivery Boy", icon: Bike },
  ]);

  const [selectedRole, setSelectedRole] = useState("");
  const [mobile, setMobile] = useState("");
  const router = useRouter();
  const { update } = useSession();
  const handleEditRole = async () => {
    try {
      const result = await axios.post("/api/user/edit-role-mobile", {
        role: selectedRole,
        mobile,
      });
      await update({ role: selectedRole });
      console.log(result.data);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const chekForAdmin = async () => {
      try {
        const result = await axios.get("/api/chek-for-admin");
        console.log(result);

        if (result.data.adminExist) {
          setRoles((prev) => prev.filter((r) => r.id !== "admin"));
        }
      } catch (error) {
        console.log(error);
      }
    };
    chekForAdmin();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 via-white to-emerald-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-xl rounded-3xl bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] p-8 sm:p-10"
      >
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl font-extrabold text-center mb-3
          bg-linear-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent"
        >
          Choose Your Role
        </motion.h1>

        <p className="text-center text-gray-500 mb-8 text-sm">
          Select your role and continue with your mobile number
        </p>

        {/* Role Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {roles.map((role) => {
            const isSelected = selectedRole === role.id;

            return (
              <motion.div
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.97 }}
                className={`relative cursor-pointer rounded-2xl p-px transition
                  ${
                    isSelected
                      ? "bg-linear-to-br from-green-500 to-emerald-400 shadow-lg"
                      : "bg-gray-200 hover:bg-linear-to-br hover:from-green-400/40 hover:to-emerald-400/40"
                  }
                `}
              >
                <div
                  className={`rounded-2xl bg-white p-6 text-center transition
                    ${isSelected ? "ring-2 ring-green-400" : "ring-1 ring-gray-200"}
                  `}
                >
                  <role.icon
                    size={32}
                    className={`mx-auto mb-3 ${
                      isSelected ? "text-green-600" : "text-gray-500"
                    }`}
                  />
                  <p className="font-semibold text-gray-800 text-sm">
                    {role.label}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile Input */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mobile Number
          </label>
          <input
            type="text"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Enter 10-digit mobile number"
            className="w-full rounded-xl px-5 py-4 text-sm
              bg-white border border-gray-300
              focus:ring-4 focus:ring-green-200 focus:border-green-500
              outline-none transition"
          />
        </div>

        {/* Button */}
        <motion.button
          disabled={!selectedRole || mobile.length !== 10}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleEditRole}
          className={`w-full rounded-xl py-4 font-semibold text-white text-sm
            bg-linear-to-r from-green-600 to-emerald-500
            shadow-lg hover:shadow-2xl transition
            ${
              selectedRole && mobile.length === 10
                ? "opacity-100"
                : "opacity-60 cursor-not-allowed"
            }
          `}
        >
          Continue →
        </motion.button>
      </motion.div>
    </div>
  );
}
