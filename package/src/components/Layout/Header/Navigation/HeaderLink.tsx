"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { HeaderItem } from "../../../../types/menu";
import { usePathname } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../../Style/style.css";

const HeaderLink: React.FC<{
  item: HeaderItem;
  isFirst?: boolean;
  submenuOpenId: number | null;
  setSubmenuOpenId: React.Dispatch<React.SetStateAction<number | null>>;
  index: number;
}> = ({ item, submenuOpenId, setSubmenuOpenId, index }) => {

  const path = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const submenuOpen = submenuOpenId === index; //เช็คจาก index

  const handleMouseEnter = () => {
    if (item.submenu && setSubmenuOpenId) setSubmenuOpenId(index);
  };

  const handleMouseLeave = () => {
    if (item.submenu && setSubmenuOpenId) setSubmenuOpenId(null);
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (item.submenu && setSubmenuOpenId) {
      setSubmenuOpenId((prev) => (prev === index ? null : index));
    }
  };

return (
    <div
      className={item.submenu ? "dropdown" : "dropdown"}
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {item.href ? (
        item.submenu ? (
          <Link
            href={item.href}
            className={`btn btn-secondary dropdown-toggle ${
              path === item.href ? "active" : ""
            }`}
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
        <span className="btn btn-secondary">{item.label}</span>
      )}

      <ul className={`dropdown-menu ${submenuOpen && item.submenu ? "show" : ""}`}>
        {item.submenu?.map((subItem, idx) => (
          <li key={idx}>
            <Link href={subItem.href} className="dropdown-item">
              {subItem.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};


export default HeaderLink;
