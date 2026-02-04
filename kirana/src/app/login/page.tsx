"use client";
import React, { FormEvent, useState } from "react";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Lock,
  EyeOff,
  Eye,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import googleImage from "@/assets/google.png";
import axios from "axios";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

type propType = {
  prevStep: (s: number) => void;
};

const Login = ({ prevStep }: propType) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const session = useSession();
  console.log(session);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn("credentials", { email, password });
      setLoading(false);
      router.push("/");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-full max-w-md bg-white p-6 rounded-xl shadow-md relative"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Back Button */}
        <motion.button
          type="button"
          className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100 transition"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        ></motion.button>

        {/* Header */}
        <motion.h2
          className="text-2xl font-bold text-center text-gray-800 mb-2"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          Login To Kirana
        </motion.h2>
        <motion.p
          className="text-center text-gray-500 mb-6"
          initial={{ y: -5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Welcome Back
        </motion.p>

        {/* Google Sign In */}
        <motion.button
          onClick={() => signIn("google", { redirectTo: "/" })}
          type="button"
          className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2.5 hover:bg-gray-100 transition"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Image src={googleImage} width={20} height={20} alt="google" />

          <span className="text-sm font-medium text-gray-700">
            Continue with Google
          </span>
        </motion.button>

        {/* Divider */}
        <motion.div
          className="flex items-center my-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="flex-1 h-px bg-gray-300" />
          <span className="px-3 text-sm text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-300" />
        </motion.div>

        {/* Form */}
        <motion.form
          className="space-y-4"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          onSubmit={handleLogin}
        >
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full pl-10 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full pl-10 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            {showPassword ? (
              <EyeOff
                className="absolute right-3 top-3.5 w-5 h-5 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <Eye
                onClick={() => setShowPassword(true)}
                className="absolute right-3 top-3.5 w-5 h-5 text-gray-500 cursor-pointer"
              />
            )}
          </div>

          {/* Role */}
          {/* <select className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
            <option value="user">User</option>
            <option value="deliveryboy">Delivery Boy</option>
            <option value="admin">Admin</option>
          </select> */}

          {/* Submit */}

          {(() => {
            const formValidation = email !== "" && password !== "";
            return (
              <motion.button
                disabled={!formValidation || loading}
                type="submit"
                className={`w-full py-2.5 rounded-lg font-semibold transition
    flex items-center justify-center gap-2
    ${
      formValidation
        ? "bg-green-600 hover:bg-green-700 text-white"
        : "bg-gray-300 text-gray-500 cursor-not-allowed"
    }
  `}
                whileHover={!loading ? { scale: 1.02 } : undefined}
                whileTap={!loading ? { scale: 0.98 } : undefined}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Login"
                )}
              </motion.button>
            );
          })()}

          {/* <motion.button
            type="button"
            className="w-full bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 transition"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Register
          </motion.button> */}
        </motion.form>

        {/* Footer */}
        <motion.p
          className="text-center text-sm text-gray-500 mt-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          Create account?{" "}
          <span
            onClick={() => router.push("/register")}
            className="text-green-600 font-medium cursor-pointer"
          >
            Register
          </span>
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default Login;
