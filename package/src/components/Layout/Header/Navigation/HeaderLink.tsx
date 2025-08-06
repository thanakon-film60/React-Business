"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { HeaderItem } from "../../../../types/menu";
import { usePathname } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../../Style/style.css";
import 'animate.css';


const HeaderLink: React.FC<{
  item: HeaderItem;
  isFirst?: boolean;
  submenuOpenId: number | null;
  setSubmenuOpenId: React.Dispatch<React.SetStateAction<number | null>>;
  index: number;
}> = ({ item, submenuOpenId, setSubmenuOpenId, index }) => {

  const path = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  //------------------------------------------------
   

  const submenuOpen = submenuOpenId === index; 

  const handleMouseEnter = () => {
    if (item.submenu) setSubmenuOpenId(index);
  };

  const handleMouseLeave = () => {
    if (item.submenu ) setSubmenuOpenId(null);
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (item.submenu ) {
      setSubmenuOpenId((prev) => (prev === index ? null : index));
    }
  };

return (
    <div
      className={"dropdown"}
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {item.href ? (
        item.submenu ? (
          <span
            // href={item.href}
            className={`btn btn-secondary dropdown-toggle ${
              path === item.href && item.submenu ? "btn-danger" : "btn-secondary"
            }`}
            role="button"
            aria-expanded={submenuOpen}
            onClick={toggleDropdown}
          >
            {item.label}
          </span>
        ) : (
          <Link
            href={item.href}
            className={`btn btn-secondary ${path === item.href ? "btn-danger" : "btn-secondary"}`}
          >
            {item.label}
          </Link>
        )
      ) : item.submenu ? (
        <span
          className={"btn btn-secondary dropdown-toggle"}
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
            <Link
              href={subItem.href}
              className={`dropdown-item${submenuOpen ? " animate__animated animate__fadeInDown" : ""}`}
              style={{ animationDelay: submenuOpen ? `${idx * 0.03 + 0.01}s` : "0s" }}
              onClick={() => setSubmenuOpenId(null)}
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
