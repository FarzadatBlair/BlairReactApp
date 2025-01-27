'use client';
import React, { act, useState } from "react";
import TopHeader from "@/components/common/TopHeader";
import { Home, Heart, BookOpen, User, Book } from "lucide-react";

export default function Layout({ children, pageTitle }: { children: React.ReactNode; pageTitle: string }) {

  const [activeTab, setActiveTab] = useState<"Get Care" | "Learn" | "Profile" | "Home">("Home");


  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      {/* TopHeader receives the variant */}
      <TopHeader variant={activeTab} />

      {/* Main Content */}
      <main className="flex-grow">{children}</main>

      {/* Bottom Navigation Bar */}
      <div className="flex justify-around p-4 bg-white shadow-md">
        <button
          onClick={() => setActiveTab("Home")}
          className={`text-sm ${
            activeTab === "Home" ? "font-bold text-black" : "text-gray-500"
          }`}
        >
          <Home className="w-6 h-6 mb-1" />
          Home
        </button>
        <button
          onClick={() => setActiveTab("Get Care")}
          className={`text-sm ${
            activeTab === "Get Care" ? "font-bold text-black" : "text-gray-500"
          }`}
        >
          <Heart className="w-6 h-6 mb-1" />
          Get Care
        </button>
        <button
          onClick={() => setActiveTab("Learn")}
          className={`text-sm ${
            activeTab === "Learn" ? "font-bold text-black" : "text-gray-500"
          }`}
        >
          <BookOpen className="w-6 h-6 mb-1" />
          Learn
        </button>
        <button
          onClick={() => setActiveTab("Profile")}
          className={`text-sm ${
            activeTab === "Profile" ? "font-bold text-black" : "text-gray-500"
          }`}
        >
          <User className="w-6 h-6 mb-1" />
          Profile
        </button>
      </div>
    </div>
  );
};


