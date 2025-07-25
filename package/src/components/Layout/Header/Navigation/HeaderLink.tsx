"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { HeaderItem } from "../../../../types/menu";
import { usePathname } from "next/navigation";
import "../../../../Style/style.css";

const HeaderLink: React.FC<{ item: HeaderItem; isFirst?: boolean }> = ({ item, isFirst }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const path = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  
  useEffect(() => {
    setSubmenuOpen(false);
  }, [path]);

  // ปิด dropdown เมื่อคลิกข้างนอก (desktop/mobile)
  useEffect(() => {
    if (!submenuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSubmenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [submenuOpen]);

  // Accessibility: ปิดเมื่อกด Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setSubmenuOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleMouseEnter = () => {
    if (item.submenu) setSubmenuOpen(true);
  };
  const handleMouseLeave = () => setSubmenuOpen(false);

  // onClick เฉพาะเมนูที่มี submenu (mobile/keyboard/desktop)
  const handleMenuClick = (e: React.MouseEvent) => {
    if (item.submenu) {
      e.preventDefault(); // ป้องกันเปลี่ยนเส้นทาง (ถ้าไม่ต้องการ)
      setSubmenuOpen((open) => !open);
    }
  };

  // เมนูหลักที่มี href
  const renderMenuLink = () => (
    <Link
      href={item.href!}
      className={`fw-bold fs-8 text-black-50 d-flex align-items-center text-truncate text-gray-979797 ellipsis-text no-decoration ${
        path === item.href ? "active" : ""
      }`}
      onClick={item.submenu ? handleMenuClick : undefined}
      aria-haspopup={!!item.submenu}
      aria-expanded={submenuOpen}
      tabIndex={0}
    >
      {item.label}
      {item.submenu && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1.5em"
          height="1.5em"
          viewBox="0 0 24 24"
          className="dropdown-arrow"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="m7 10l5 5l5-5"
          />
        </svg>
      )}
    </Link>
  );

  // เมนูหลักที่ไม่มี href (เช่น dropdown-only)
  const renderMenuSpan = () => (
    <span
      className="fw-bold fs-8 text-black-50 d-flex align-items-center text-truncate text-gray-979797 ellipsis-text no-decoration"
      onClick={item.submenu ? handleMenuClick : undefined}
      aria-haspopup={!!item.submenu}
      aria-expanded={submenuOpen}
      tabIndex={0}
      role={item.submenu ? "button" : undefined}
    >
      {item.label}
      {item.submenu && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1.5em"
          height="1.5em"
          viewBox="0 0 24 24"
          className="dropdown-arrow"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="m7 10l5 5l5-5"
          />
        </svg>
      )}
    </span>
  );

  return (
    <>
    <div></div>
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={dropdownRef}
    >
      {/* dropdown menu */}
      {submenuOpen && item.submenu && (
        <div
          className="absolute py-2 left-0 mt-0.5 w-60 bg-white dark:bg-darklight dark:text-white shadow-lg rounded-lg "
          data-aos="fade-up"
          data-aos-duration="500"
        >
          {item.submenu.map((subItem, index) => (
            <Link
              key={index}
              href={subItem.href}
              className="block px-4 py-2 text-black dark:text-white hover:bg-primary"
              tabIndex={0}
              onClick={() => setSubmenuOpen(false)}
            >
              {subItem.label}
            </Link>
          ))}
        </div>
      )}
      <div className="relative z-10">
        <div>
          {/* ถ้ามี href จริงให้ใช้ Link ถ้าไม่มีใช้ span */}
          {item.href ? renderMenuLink() : renderMenuSpan()}
        </div>
      </div>
    </div>
     </>
  );
 
};

export default HeaderLink;
