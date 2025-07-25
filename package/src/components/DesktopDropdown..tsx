import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

const DesktopDropdown = ({ item }: { item: any }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // ปิด dropdown เมื่อคลิกข้างนอก
  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div
      className="relative"
      ref={ref}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      tabIndex={0}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <button
        className="flex items-center gap-1 px-4 py-2 hover:text-primary transition"
        onClick={() => setOpen((o) => !o)}
        type="button"
      >
        {item.label}
        <span className="bi bi-chevron-down ml-1 text-xs"></span>
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-2 bg-white shadow-lg rounded-md min-w-[180px] z-50 border">
          <div className="py-2">
            {item.submenu.map((sub: any, i: number) => (
              <Link
                key={i}
                href={sub.href}
                className="block px-4 py-2 hover:bg-gray-100"
                tabIndex={0}
              >
                {sub.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default DesktopDropdown;
