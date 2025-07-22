"use client";
import { useState } from "react";
import Link from "next/link";
import { HeaderItem } from "../../../../types/menu";
import { usePathname } from "next/navigation";
import "../../../../Style/style.css";

const HeaderLink: React.FC<{ item: HeaderItem; isFirst?: boolean }> = ({ item, isFirst }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const path = usePathname();

  const handleMouseEnter = () => {
    if (item.submenu) setSubmenuOpen(true);
  };
  const handleMouseLeave = () => setSubmenuOpen(false);

  // เมนูหลักที่มี href
  const renderMenuLink = () => (
    <Link
      href={item.href!}
      className={`fw-bold fs-8 text-black-50 d-flex align-items-center text-truncate text-gray-979797 ellipsis-text no-decoration ${
        path === item.href ? "active" : ""
      }`}
    >
      {item.label}
      {item.submenu && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1.5em"
          height="1.5em"
          viewBox="0 0 24 24"
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
    >
      {item.label}
      {item.submenu && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1.5em"
          height="1.5em"
          viewBox="0 0 24 24"
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
    <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="menu-list">
        <div className="menu-item-wrapper">
          {/* ถ้ามี href จริงให้ใช้ Link ถ้าไม่มีใช้ span */}
          {item.href ? renderMenuLink() : renderMenuSpan()}
        </div>
      </div>
      {/* dropdown menu */}
      {submenuOpen && item.submenu && (
        <div
          className="absolute py-2 left-0 mt-0.5 w-60 bg-white dark:bg-darklight dark:text-white shadow-lg rounded-lg"
          data-aos="fade-up"
          data-aos-duration="500"
        >
          {item.submenu.map((subItem, index) => (
            <Link
              key={index}
              href={subItem.href}
              className={`block px-4 py-2 ${
                path === subItem.href
                  ? "text-white bg-primary"
                  : "text-black dark:text-white hover:bg-primary"
              }`}
            >
              {subItem.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default HeaderLink;
