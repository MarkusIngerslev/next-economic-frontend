"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-600 to-violet-400 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full flex flex-col items-center text-center bg-gradient-to-tl from-gray-100 to-white shadow-xl rounded-2xl p-8 border">
        {/* SVG Illustration */}
        <div className="w-full mb-6">
          <img
            src="/personal-finance-illustration.svg"
            alt="Økonomi illustration"
            className="mx-auto w-48 h-48"
          />
        </div>

        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
          Velkommen til din økonomioversigt
        </h1>
        <p className="text-gray-600 mb-6 text-lg">
          Få overblik over din indtægt, dit forbrug og dine vaner.
        </p>

        {/* Animated Button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition duration-200 shadow"
          >
            Log ind
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
