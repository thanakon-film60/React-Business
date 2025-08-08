"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "./Logo"; // สมมุติว่าคุณมีโลโก้แล้ว
import HeaderLink from "../Header/Navigation/HeaderLink"; // สมมุติว่าเมนูแต่ละรายการแยก component แล้ว
import { headerData } from "../../Layout/Header/Navigation/menuData"; 
import { usePathname } from "next/navigation";

const Header = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [submenuOpenId, setSubmenuOpenId] = useState<number | null>(null);
  const path = usePathname();


  useEffect(() => {
    setSubmenuOpenId(null); 
  console.log("wtf")
}, [path]);

  // ปิดเมนูเมื่อคลิกข้างนอก
useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(event.target as Node) &&
      navbarOpen
    ) {
      setNavbarOpen(false);
      
    }
  }
  if (navbarOpen) {
    document.addEventListener("mousedown", handleClickOutside);
  }
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [navbarOpen]);
 
  const menu1 = headerData.slice(0, 4); 
  const menu2 = headerData.slice(4);   

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white shadow-sm border-b border-black/60">
      <div className="w-full max-w-screen-2xl mx-auto flex items-center h-[100px] px-2 md:px-4 flex-nowrap">
        
      <nav className="hidden xl:flex flex-1 justify-end gap-2 min-w-0 whitespace-nowrap relative items-center">
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

       
        <div className="flex-shrink-0 flex justify-center px-4">
          <Logo />
        </div>

        
        <nav className="hidden xl:flex flex-1 justify-start gap-3 min-w-0 items-center whitespace-nowrap">
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
        
          <div className="flex gap-4 items-center ml-4">
            <Link href="/en" className="flex items-center gap-1 lang-link">
              <Image src="/images/icons/us.svg" width={20} height={14} alt="English" />
              <span className="hidden 2xl:inline lang-text text-xs">English</span>
            </Link>
            <Link href="/th" className="flex items-center gap-1 lang-link">
              <Image src="/images/icons/th.svg" width={20} height={14} alt="Thai" />
              <span className="hidden 2xl:inline lang-text text-xs">Thai</span>
            </Link>
          </div>
        </nav>

    
        <button
          className="xl:hidden flex ms-auto p-2"
          onClick={() => setNavbarOpen((prev) => !prev)}
          aria-label="Open menu"
        >
          <i className="bi bi-list text-3xl"></i>
        </button>
      </div>

      
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
  );
};

export default Header;
