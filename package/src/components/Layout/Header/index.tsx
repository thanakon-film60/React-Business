"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { headerData } from "../Header/Navigation/menuData";
import Logo from "./Logo";
import Image from "next/image";
import HeaderLink from "../Header/Navigation/HeaderLink";

const Header: React.FC = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setNavbarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [menu1, menu2] = [headerData.slice(0, 4), headerData.slice(4)];

return (
  <header className="fixed top-0 left-0 right-0 z-40 bg-white shadow-sm border-b border-black/60">
    <div className="w-full max-w-screen-2xl mx-auto flex items-center h-[120px] px-2 md:px-4 flex-nowrap">
      
      {/* ซ้าย: เมนูซ้าย */}
      <nav className="hidden xl:flex flex-1 justify-end min-w-0 gap-2">
        {menu1.map((item, i) => (
          <HeaderLink key={i} item={item} />
        ))}
      </nav>

      {/* โลโก้กลาง */}
      <div className="flex-shrink-0 flex justify-center px-4">
        <Logo />
      </div>

      {/* ขวา: เมนูขวา + ภาษา */}
      <nav className="hidden xl:flex flex-1 justify-start min-w-0 gap-3 items-center">
        {menu2.map((item, i) => (
          <HeaderLink key={i + menu1.length} item={item} />
        ))}
        <div className="flex gap-4 items-center ml-4">
          <Link href="/en" className="flex items-center gap-1 lang-link">
            <Image src="/images/icons/us.svg" width={20} height={14} alt="English" />
            <span className="hidden 2xl:inline lang-text">English</span>
          </Link>
          <Link href="/th" className="flex items-center gap-1 lang-link">
            <Image src="/images/icons/th.svg" width={20} height={14} alt="Thai" />
            <span className="hidden 2xl:inline lang-text">Thai</span>
          </Link>
        </div>
      </nav>

      {/* ปุ่ม Burger เฉพาะ Mobile */}
      <button
        className="xl:hidden flex ms-auto p-2"
        onClick={() => setNavbarOpen((prev) => !prev)}
        aria-label="Open menu"
      >
        <i className="bi bi-list text-3xl"></i>
      </button>
    </div>

    {/* ----------- Mobile Menu Side Panel ----------- */}
    <div
      ref={mobileMenuRef}
      className={`
        fixed inset-y-0 right-0 bg-white w-[320px] max-w-full shadow-lg transition-transform duration-300
        ${navbarOpen ? "translate-x-0" : "translate-x-full"}
        xl:hidden z-[9999]
      `}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-bold">Menu</h2>
        <button onClick={() => setNavbarOpen(false)} aria-label="Close menu">
          <i className="bi bi-x-lg text-2xl"></i>
        </button>
      </div>
      <nav className="p-4 overflow-auto flex flex-col gap-4">
        {headerData.map((item, i) => (
          <div key={i}>
            {item.submenu ? (
              <details>
                <summary className="font-bold cursor-pointer">{item.label}</summary>
                <div className="flex flex-col pl-4 mt-2">
                  {item.submenu.map((sub, j) => (
                    <Link
                      key={j}
                      href={sub.href}
                      onClick={() => setNavbarOpen(false)}
                      className="py-1"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              </details>
            ) : (
              <Link
                href={item.href}
                onClick={() => setNavbarOpen(false)}
                className="py-1"
              >
                {item.label}
              </Link>
            )}
          </div>
        ))}
        {/* Language Switcher */}
        <div className="mt-4 border-t pt-4 flex gap-4">
          <Link
            href="/en"
            className="flex items-center gap-1 lang-link"
            onClick={() => setNavbarOpen(false)}
          >
            <Image src="/images/icons/us.svg" width={20} height={14} alt="English" />
            <span>English</span>
          </Link>
          <Link
            href="/th"
            className="flex items-center gap-1 lang-link"
            onClick={() => setNavbarOpen(false)}
          >
            <Image src="/images/icons/th.svg" width={20} height={14} alt="Thai" />
            <span>Thai</span>
          </Link>
        </div>
      </nav>
    </div>
    {/* ----------- End Mobile Menu Side Panel ----------- */}

  </header>
)

};

export default Header;
