"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Trees, Bot, Stethoscope, Calendar, History } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  const items = [
    { label: "Home", labelTe: "హోమ్", href: "/", icon: Home },
    { label: "My Farm", labelTe: "నా పొలం", href: "/my-farm", icon: Trees },
    { label: "Ask AI", labelTe: "AI అడగండి", href: "/ask-ai", icon: Bot, isCenter: true },
    { label: "Crop Doctor", labelTe: "క్రాప్ డాక్టర్", href: "/crop-doctor", icon: Stethoscope },
    { label: "Calendar", labelTe: "క్యాలెండర్", href: "/calendar", icon: Calendar },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 shadow-lg">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.isCenter) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center -mt-6 focus:outline-none group"
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-700 text-white shadow-lg border-4 border-slate-50 group-active:scale-95 transition-transform">
                  <Icon className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-bold text-emerald-800 mt-1">
                  AI అడగండి
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-12 py-1 transition-colors ${
                isActive ? "text-emerald-700 font-bold" : "text-slate-400 hover:text-slate-600 font-medium"
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">{item.labelTe}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
