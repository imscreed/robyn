"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, Bell, Settings, User, Menu, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopBarProps {
  onMenuToggle: () => void;
  isMenuCollapsed: boolean;
}

export function TopBar({ onMenuToggle }: TopBarProps) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm"
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </button>

          {/* Search Bar */}
          <div className="relative hidden sm:block">
            <motion.div whileFocus={{ scale: 1.02 }} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className={cn(
                  "pl-10 pr-4 py-2 w-64 lg:w-80 rounded-lg border border-slate-200",
                  "bg-slate-50 focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-200",
                  "transition-all duration-200 text-sm placeholder-slate-400",
                  "focus:outline-none"
                )}
              />
            </motion.div>
          </div>
        </div>

        {/* Center Section - Breadcrumb */}
        <div className="hidden md:flex items-center space-x-2 text-sm text-slate-600">
          <span className="font-medium text-blue-600">Dashboard</span>
          <span>/</span>
          <span>Home</span>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Sun className="w-5 h-5 text-slate-600" />
          </motion.button>

          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Bell className="w-5 h-5 text-slate-600" />
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full flex items-center justify-center"
            >
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            </motion.span>
          </motion.button>

          {/* Settings */}
          <motion.button
            whileHover={{ scale: 1.05, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Settings className="w-5 h-5 text-slate-600" />
          </motion.button>

          {/* User Profile */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center space-x-3 pl-3 pr-4 py-2 rounded-lg hover:bg-slate-100 transition-colors duration-200 cursor-pointer"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-slate-800">John Doe</p>
              <p className="text-xs text-slate-500">Admin</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="sm:hidden px-6 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className={cn(
              "pl-10 pr-4 py-2 w-full rounded-lg border border-slate-200",
              "bg-slate-50 focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-200",
              "transition-all duration-200 text-sm placeholder-slate-400",
              "focus:outline-none"
            )}
          />
        </div>
      </div>
    </motion.header>
  );
}
