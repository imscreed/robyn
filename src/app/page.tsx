"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-full flex items-center justify-center">
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-bold text-slate-800 leading-tight"
        >
          Hello World,{" "}
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-yellow-500 bg-clip-text text-transparent">
            I&apos;m Robyn
          </span>
        </motion.h1>
      </div>
    </div>
  );
}
