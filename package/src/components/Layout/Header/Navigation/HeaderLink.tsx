"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { HeaderItem } from "../../../../types/menu";
import { usePathname } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../../Style/style.css";

const HeaderLink: React.FC<{ item: HeaderItem; isFirst?: boolean }> = ({ item }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const path = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSubmenuOpen(false);
  }, [path]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSubmenuOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setSubmenuOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // เปิด dropdown เมื่อเมาส์ hover
  const handleMouseEnter = () => {
    if (item.submenu) setSubmenuOpen(true);
  };

  const handleMouseLeave = () => {
    if (item.submenu) setSubmenuOpen(false);
  };

  // เปิด-ปิด dropdown เมื่อกดปุ่ม (toggle)
  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (item.submenu) setSubmenuOpen((open) => !open);
  };

  return (
    <div
      className={item.submenu ? "dropdown" : ""}
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {item.href ? (
        item.submenu ? (
          <Link
            href={item.href}
            className={`btn btn-secondary dropdown-toggle ${path === item.href ? "active" : ""}`}
            role="button"
            aria-expanded={submenuOpen}
            onClick={toggleDropdown}
          >
            {item.label}
          </Link>
        ) : (
          <Link
            href={item.href}
            className={`btn btn-secondary ${path === item.href ? "active" : ""}`}
          >
            {item.label}
          </Link>
        )
      ) : item.submenu ? (
        <span
          className="btn btn-secondary dropdown-toggle"
          role="button"
          aria-expanded={submenuOpen}
          onClick={toggleDropdown}
        >
          {item.label}
        </span>
      ) : (
        <span className="btn btn-secondary">
          {item.label}
        </span>
      )}

      <ul className={`dropdown-menu${submenuOpen && item.submenu ? " show" : ""}`}>
        {item.submenu?.map((subItem, idx) => (
          <li key={idx}>
            <Link
              href={subItem.href}
              className="dropdown-item"
              onClick={() => setSubmenuOpen(false)}
            >
              {subItem.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HeaderLink;
