"use client";

import { useMemo, useState } from "react";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
// Fallback curated icons to avoid empty UI if bundler tree-shakes dynamic namespace
import {
  Activity,
  Airplay,
  AlarmClock,
  AlertCircle,
  AtSign,
  Bell,
  BookOpen,
  Briefcase,
  Calendar,
  Camera,
  Check,
  ChevronRight,
  Circle,
  Code,
  Cpu,
  Database,
  FileText,
  Globe,
  Heart,
  Home,
  Layers,
  Mail,
  MapPin,
  Monitor,
  Phone,
  Play,
  Search,
  Send,
  Settings,
  Star,
  Users,
} from "lucide-react";

interface IconPickerProps {
  value?: string; // اسم الأيقونة المختارة
  onChange: (iconName: string) => void; // لما تختار أيقونة جديدة
}

export default function IconPicker({ value, onChange }: IconPickerProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  // لو في أيقونة متخزنة نجيبها
  const SelectedIcon =
    value && (LucideIcons[value as keyof typeof LucideIcons] as LucideIcon);

  // تحضير قائمة الأيقونات (مع فallback لو الـ namespace فاضي)
  const allNamespaceIcons = useMemo(() => {
    const entries = Object.entries(LucideIcons).filter(
      ([name, Icon]) => typeof Icon === "function" && /^[A-Z]/.test(name)
    );
    if (entries.length === 0) {
      // Fallback to curated set
      const curated: Record<string, LucideIcon> = {
        Activity,
        Airplay,
        AlarmClock,
        AlertCircle,
        AtSign,
        Bell,
        BookOpen,
        Briefcase,
        Calendar,
        Camera,
        Check,
        ChevronRight,
        Circle,
        Code,
        Cpu,
        Database,
        FileText,
        Globe,
        Heart,
        Home,
        Layers,
        Mail,
        MapPin,
        Monitor,
        Phone,
        Play,
        Search,
        Send,
        Settings,
        Star,
        Users,
      };
      return Object.entries(curated);
    }
    return entries as [string, LucideIcon][];
  }, []);

  // قائمة الأيقونات بعد الفلترة
  const normalized = search.trim();
  const useFilter = /[A-Za-z0-9-]/.test(normalized); // لو البحث بحروف غير لاتينية اعرض كل الأيقونات
  const filtered = useMemo(() => {
    const list = allNamespaceIcons.filter(([name]) => {
      if (!useFilter) return true;
      return name.toLowerCase().includes(normalized.toLowerCase());
    });
    // تشخيص سريع في الكونسول
    if (typeof window !== "undefined") {
      // eslint-disable-next-line no-console
      console.debug("IconPicker counts", {
        total: allNamespaceIcons.length,
        filtered: list.length,
        query: normalized,
        useFilter,
      });
    }
    return list;
  }, [allNamespaceIcons, normalized, useFilter]);

  return (
    <div className="relative w-full">
      {/* الزرار اللي بيعرض الأيقونة المختارة */}
      <button
        type="button"
        className="w-full flex items-center justify-between px-3 py-2 border rounded-lg bg-white shadow-sm hover:bg-gray-50"
        onClick={() => setOpen(!open)}
      >
        <span className="flex items-center gap-2">
          {SelectedIcon ? <SelectedIcon className="h-5 w-5" /> : "اختر أيقونة"}
        </span>
        <span className="text-gray-500 text-sm">▼</span>
      </button>

      {/* البوب أب الخاص باختيار الأيقونات */}
      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white border rounded-lg shadow-lg p-3 max-h-72 overflow-y-auto">
          {/* البحث */}
          <input
            type="text"
            placeholder="ابحث عن أيقونة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const first = filtered[0];
                if (first) {
                  const [name] = first;
                  onChange(name);
                  setOpen(false);
                }
              } else if (e.key === "Escape") {
                setOpen(false);
              }
            }}
            className="w-full mb-3 px-2 py-1 border rounded-md focus:ring focus:ring-blue-200"
          />

          {/* قائمة الأيقونات */}
          {filtered.length === 0 && useFilter ? (
            <div className="text-sm text-gray-500 flex items-center justify-between">
              <span>لا توجد أيقونات مطابقة</span>
              <button
                type="button"
                className="text-blue-600 hover:underline"
                onClick={() => setSearch("")}
              >
                مسح البحث
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-6 gap-2">
              {filtered.map(([name, Icon]) => {
                const IconComp = Icon as LucideIcon;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => {
                      onChange(name);
                      setOpen(false);
                    }}
                    className={`p-2 rounded-md flex items-center justify-center hover:bg-gray-100 ${
                      value === name ? "bg-blue-50 text-blue-600" : ""
                    }`}
                    title={name}
                  >
                    <IconComp className="h-5 w-5" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
