"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "./Logo";
import HeaderLink from "../Navigation/HeaderLink";
import { headerData } from "../Navigation/menuData";
import { usePathname } from "next/navigation";
import DrawerMenu from "../Navigation/DrawerMenu";

const Header = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [submenuOpenId, setSubmenuOpenId] = useState<number | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const path = usePathname();

  useEffect(() => {
    setSubmenuOpenId(null);
    setNavbarOpen(false);
  }, [path]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!navbarOpen) return;
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node)
      ) {
        setNavbarOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNavbarOpen(false);
    };
    if (navbarOpen) {
      document.addEventListener("mousedown", onDown);
      document.addEventListener("keydown", onKey);
    }
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [navbarOpen]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = navbarOpen ? "hidden" : prev || "";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [navbarOpen]);

  const menu1 = headerData.slice(0, 4);
  const menu2 = headerData.slice(4);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur border-b border-black/10">
      <div className="w-full max-w-screen-2xl mx-auto flex items-center h-16 md:h-20 [@media(min-width:1600px)]:h-[100px] px-3 md:px-4">
        {/* ซ้าย (เดสก์ท็อป ≥1600) */}
        <nav className="desktop-1600 flex-1 justify-end gap-2 min-w-0 whitespace-nowrap items-center">
          {menu1.map((item, i) => (
            <HeaderLink
              key={i}
              item={item}
              index={i}
              submenuOpenId={submenuOpenId}
              setSubmenuOpenId={setSubmenuOpenId}
            />
          ))}
        </nav>

        {/* โลโก้กลาง */}
        <div className="flex-shrink-0 flex justify-center px-2 md:px-4">
          {/* ลดกว้างโลโก้เล็กน้อยบนจอแคบ แล้วค่อยขยาย ≥1600px */}
          <Logo className="w-[160px] [@media(min-width:1600px)]:w-[205px]" />
        </div>

        {/* ขวา (เดสก์ท็อป ≥1600) */}
        <nav className="desktop-1600 flex-1 justify-start gap-3 min-w-0 items-center whitespace-nowrap">
          {menu2.map((item, i) => {
            const index = i + menu1.length;
            return (
              <HeaderLink
                key={index}
                item={item}
                index={index}
                submenuOpenId={submenuOpenId}
                setSubmenuOpenId={setSubmenuOpenId}
              />
            );
          })}

          {/* สวิตช์ภาษา: ข้อความจะแสดงเฉพาะ ≥1600px (ควบคุมด้วย .lang-mini) */}
          <div className="flex gap-4 items-center ml-4 lang-mini">
            <Link href="/en" className="flex items-center gap-1 lang-link">
              <Image
                src="/images/icons/us.svg"
                width={20}
                height={14}
                alt="English"
              />
              <span className="text-xs">English</span>
            </Link>
            <Link href="/th" className="flex items-center gap-1 lang-link">
              <Image
                src="/images/icons/th.svg"
                width={20}
                height={14}
                alt="Thai"
              />
              <span className="text-xs">Thai</span>
            </Link>
          </div>
        </nav>

        {/* ปุ่ม 3 ขีด: แสดงเฉพาะ <1600px */}
        <button
          className="mobile-1600 ms-auto p-2 -mr-1"
          onClick={() => setNavbarOpen((prev) => !prev)}
          aria-label={navbarOpen ? "Close menu" : "Open menu"}
          aria-expanded={navbarOpen}>
          <i className="bi bi-list text-3xl"></i>
        </button>
      </div>

      {/* Overlay มือถือ <1600px */}
      <DrawerMenu
        ref={mobileMenuRef}
        isOpen={navbarOpen}
        onClose={() => setNavbarOpen(false)}
        items={headerData}
      />

      {/* Mobile Drawer <1600px */}
    </header>
  );
};

export default Header;
