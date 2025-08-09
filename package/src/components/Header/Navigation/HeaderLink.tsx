"use client";
import { useRef } from "react";
import Link from "next/link";
import { HeaderItem } from "../../../types/menu";
import { usePathname } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/Style/style.css";

import "animate.css";

const HeaderLink: React.FC<{
  item: HeaderItem;
  isFirst?: boolean;
  submenuOpenId: number | null;
  setSubmenuOpenId: React.Dispatch<React.SetStateAction<number | null>>;
  index: number;
}> = ({ item, submenuOpenId, setSubmenuOpenId, index }) => {
  const path = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ปุ่มหลักที่มี submenu เปิดเมนูเมื่อ hover
  const submenuOpen = submenuOpenId === index;
  const isMainMenuWithSubmenu = !!item.submenu;

  return (
    <div
      className="dropdown"
      ref={dropdownRef}
      onMouseEnter={() => setSubmenuOpenId(index)}
      onMouseLeave={() => setSubmenuOpenId(null)}
      tabIndex={-1}
      style={{ position: "relative" }}>
      {/* ปุ่มหลักที่มี submenu (กดไม่ได้) */}
      {isMainMenuWithSubmenu ? (
        <span
          className={`btn btn-secondary dropdown-toggle${
            submenuOpen ? " btn-danger" : ""
          } menu-main-disabled`}
          role="button"
          aria-expanded={submenuOpen}
          tabIndex={-1}
          // ป้องกันคลิก/โฟกัส
          style={{
            cursor: "pointer",
            pointerEvents: "none",
            userSelect: "none",
          }}>
          {item.label}
        </span>
      ) : // ปุ่มหลักที่ไม่มี submenu (กดได้)
      item.href ? (
        <Link
          href={item.href}
          className={`btn btn-secondary ${
            path === item.href ? "btn-danger" : ""
          }`}>
          {item.label}
        </Link>
      ) : (
        <span className="btn btn-secondary">{item.label}</span>
      )}

      {/* เมนูย่อย */}
      {isMainMenuWithSubmenu && (
        <ul
          className={`dropdown-menu ${submenuOpen ? "show" : ""}`}
          style={{
            display: submenuOpen ? "block" : "none",
            zIndex: 1000,
          }}>
          {item.submenu?.map((subItem, idx) => (
            <li key={idx}>
              <Link
                href={subItem.href}
                className={`dropdown-item${
                  submenuOpen ? " animate__animated animate__fadeInDown" : ""
                }`}
                style={{
                  animationDelay: submenuOpen ? `${idx * 0.03 + 0.01}s` : "0s",
                }}
                onClick={() => {
                  setSubmenuOpenId(null); // ปิดเมนูทันทีหลังคลิก
                  if (document.activeElement instanceof HTMLElement)
                    document.activeElement.blur();
                }}>
                {subItem.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HeaderLink;
