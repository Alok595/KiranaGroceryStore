"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-20 bg-linear-to-r from-green-600 via-emerald-500 to-green-600 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 sm:grid-cols-2 md:grid-cols-4">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-extrabold tracking-wide">Kirana</h2>
          <p className="mt-3 text-sm text-white/80 leading-relaxed">
            Your trusted grocery delivery partner. Fresh products, fast
            delivery, and best prices — every day.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm text-white/90">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link href="/user/my-orders" className="hover:underline">
                Orders
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:underline">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide mb-4">
            Support
          </h3>
          <ul className="space-y-2 text-sm text-white/90">
            <li>
              <Link href="/help" className="hover:underline">
                Help Center
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:underline">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:underline">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide mb-4">
            Contact
          </h3>
          <ul className="space-y-3 text-sm text-white/90">
            <li className="flex items-center gap-2">
              <Mail size={16} /> support@kirana.com
            </li>
            <li className="flex items-center gap-4 mt-3">
              <a href="#" className="hover:scale-110 transition">
                <Facebook size={18} />
              </a>
              <a href="#" className="hover:scale-110 transition">
                <Instagram size={18} />
              </a>
              <a href="#" className="hover:scale-110 transition">
                <Twitter size={18} />
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/20 py-4 text-center text-sm text-white/80">
        © {new Date().getFullYear()} Kirana. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
