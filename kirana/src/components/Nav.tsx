"use client";

import Link from "next/link";
import Image from "next/image";
import { FormEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Scale, Search, ShoppingCart, User } from "lucide-react";
import { signOut } from "next-auth/react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";

interface IUser {
  _id?: string;
  name: string;
  email: string;
  role: "user" | "deliveryboy" | "admin";
  image?: string;
}

const Nav = ({ user }: { user: IUser }) => {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const profileDropDown = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const { cartData } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileDropDown.current &&
        !profileDropDown.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const query = search.trim();
    if (!query) {
      return router.push("/");
    }
    router.push(`/?q=${encodeURIComponent(query)}`);
    setSearch("");
    setSearchOpen(false);
  };

  return (
    <div className="w-full pt-4">
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-3 left-3 right-3 z-[100] rounded-3xl bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 shadow-2xl ring-1 ring-white/30 backdrop-blur-xl"
      >
        <div className="h-16 px-6 flex items-center justify-between gap-6">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-extrabold text-white tracking-wide flex gap-1"
          >
            <Scale className="w-8 h-8 text-white" />
            <Link href="/">Kirana</Link>
          </motion.div>

          {/* Desktop Search */}
          {user.role === "user" && (
            <form
              onSubmit={handleSearch}
              className="hidden sm:flex flex-1 justify-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="relative w-full max-w-lg"
              >
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  type="text"
                  placeholder="Search groceries..."
                  className="w-full rounded-full pl-11 pr-4 py-2.5 text-sm text-white placeholder-white/70 bg-white/20 border border-white/30 focus:outline-none focus:ring-4 focus:ring-white/30 transition"
                />
              </motion.div>
            </form>
          )}

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Mobile Search */}
            {user.role === "user" && (
              <div className="sm:hidden relative" ref={searchRef}>
                <motion.button
                  aria-label="Search"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSearchOpen((prev) => !prev)}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
                >
                  <Search size={22} className="text-white" />
                </motion.button>

                <AnimatePresence>
                  {searchOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.96 }}
                      transition={{ duration: 0.2 }}
                      className="fixed top-[88px] left-3 right-3 z-50"
                    >
                      <div className="w-full bg-white rounded-2xl shadow-lg p-2">
                        <form onSubmit={handleSearch}>
                          <div className="relative">
                            <Search
                              size={18}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                              type="text"
                              placeholder="Search groceries..."
                              className="w-full rounded-full pl-10 pr-4 py-2.5 text-sm text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                        </form>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Cart */}
            {user.role === "user" && (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
              >
                <Link href="/user/cart">
                  <ShoppingCart size={22} className="text-white" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 text-[10px] rounded-full bg-white text-green-600 flex items-center justify-center font-bold">
                    {cartData.length}
                  </span>
                </Link>
              </motion.div>
            )}

            {user.role === "admin" && (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/admin/add-grocery">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white text-sm font-semibold transition"
                  >
                    ➕ Add Grocery
                  </motion.div>
                </Link>

                <Link href="/admin/view-grocery">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white text-sm font-semibold transition"
                  >
                    📦 Groceries
                  </motion.div>
                </Link>

                <Link href="/admin/manage-orders">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white text-sm font-semibold transition"
                  >
                    🧾 Orders
                  </motion.div>
                </Link>
              </div>
            )}

            {/* Profile Dropdown */}
            <div className="relative" ref={profileDropDown}>
              <motion.button
                aria-label="Profile menu"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full px-2 py-1 bg-white/20 hover:bg-white/30 transition"
              >
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt="profile"
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
                    <User size={18} className="text-green-600" />
                  </div>
                )}
                <span className="hidden md:block text-sm font-semibold text-white">
                  {user?.name || "Account"}
                </span>
              </motion.button>

              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.96 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 mt-3 w-56 rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden z-50"
                  >
                    <div className="flex items-center gap-3 px-4 py-3 border-b">
                      {user?.image ? (
                        <Image
                          src={user.image}
                          alt="profile"
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center">
                          <User size={18} className="text-white" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.role}
                        </p>
                      </div>
                    </div>

                    <div className="py-2">
                      {user.role === "user" && (
                        <Link href="/user/my-orders">
                          <motion.div
                            whileHover={{ x: 4 }}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-green-50 cursor-pointer transition"
                          >
                            <ShoppingCart
                              size={16}
                              className="text-green-600"
                            />
                            <span>My Orders</span>
                          </motion.div>
                        </Link>
                      )}

                      <motion.div
                        onClick={() => {
                          setOpen(false);
                          signOut({ callbackUrl: "/login" });
                        }}
                        whileHover={{ x: 4 }}
                        className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 cursor-pointer transition"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Spacer so content doesn't hide behind fixed navbar */}
      <div className="h-[88px]" />

      {/* ------------------ Mobile Bottom Nav (Admin Only) ------------------ */}
      {user.role === "admin" && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-[100] sm:hidden"
        >
          <div className="mx-3 mb-3 rounded-3xl bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 shadow-2xl ring-1 ring-white/30">
            <div className="flex items-center justify-around py-3">
              <Link href="/admin/add-grocery">
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="flex flex-col items-center text-white text-xs font-semibold"
                >
                  <span className="text-xl">➕</span>
                  <span>Add Grocery</span>
                </motion.div>
              </Link>

              <Link href="/admin/view-grocery">
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="flex flex-col items-center text-white text-xs font-semibold"
                >
                  <span className="text-xl">📦</span>
                  <span>Grocery</span>
                </motion.div>
              </Link>

              <Link href="/admin/manage-orders">
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="flex flex-col items-center text-white text-xs font-semibold"
                >
                  <span className="text-xl">🧾</span>
                  <span>Orders</span>
                </motion.div>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Nav;
