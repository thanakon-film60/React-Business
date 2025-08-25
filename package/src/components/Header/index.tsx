// components/Header/index.tsx
"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "./Logo";
import HeaderLink from "../Navigation/HeaderLink";
import { headerData } from "../Navigation/menuData";
import { usePathname } from "next/navigation";
import DrawerMenu from "../Navigation/DrawerMenu";
import LanguageSwitch from "./LanguageSwitch";

const Header = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [submenuOpenId, setSubmenuOpenId] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false); // ⭐ เพิ่ม state สำหรับเงา
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const path = usePathname();

  useEffect(() => {
    setSubmenuOpenId(null);
    setNavbarOpen(false);
  }, [path]);

  // ⭐ เงาเมื่อสกรอลล์
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 2);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <header
      data-site-header
      className={[
        "fixed top-0 left-0 right-0 z-40",
        "bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80",
        !scrolled
          ? "shadow-[0_1px_0_rgba(0,0,0,0.06)]"
          : "shadow-[0_12px_28px_-16px_rgba(0,0,0,0.28)] md:shadow-[0_18px_48px_-22px_rgba(0,0,0,0.32)]",
        "transition-shadow duration-300",
      ].join(" ")}>
      <div className="w-full max-w-screen-2xl mx-auto flex items-center h-16 md:h-20 [@media(min-width:1600px)]:h-[100px] px-3 md:px-4">
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

        <div className="overflow-hidden min-w-0 flex items-center flex-1 [@media(min-width:1600px)]:flex-none">
          <Logo className="w-[clamp(120px,40vw,205px)] h-auto max-w-[calc(100vw-72px)]" />
        </div>

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

          <LanguageSwitch className="ml-4 lang-mini" />
        </nav>

        <button
          className="mobile-1600 ms-auto p-2 -mr-1"
          onClick={() => setNavbarOpen((prev) => !prev)}
          aria-label={navbarOpen ? "Close menu" : "Open menu"}
          aria-expanded={navbarOpen}>
          <i className="bi bi-list text-3xl"></i>
        </button>
      </div>
      <DrawerMenu
        ref={mobileMenuRef}
        isOpen={navbarOpen}
        onClose={() => setNavbarOpen(false)}
        items={headerData}
      />
    </header>
  );
};

export default Header;
