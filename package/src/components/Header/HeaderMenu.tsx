import React from "react";
import Link from "next/link";

export interface MenuItem {
  label: string;
  href?: string;
  submenu?: { label: string; href: string }[];
}

interface HeaderMenuProps {
  menu: MenuItem[];
  justify?: "start" | "end" | "center";
}

const HeaderMenu: React.FC<HeaderMenuProps> = ({ menu, justify = "start" }) => {
  return (
    <div className={`d-flex menu-desktop flex-grow-1 align-items-center gap-2 justify-content-${justify}`}>
      {menu.map((item, i) =>
        item.submenu ? (
          <div className="menu-item-wrapper with-dropdown" key={i}>
            <div className="dropdown w-100 h-100">
              <button
                className="btn btn-link dropdown-toggle text-gray-979797 w-100 h-100 fw-bold no-decoration"
                type="button"
                id={`dropdownMenuButton-${i}`}
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{
                  borderRadius: "0.75rem",
                  fontWeight: "bold",
                  fontSize: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                {item.label}
              </button>
              <ul
                className="dropdown-menu rounded-2xl border-0 py-2"
                style={{
                  background: "rgba(253, 251, 251, 1)",
                  boxShadow: "rgba(0, 0, 0, 0.28) 0px 4px 24px 0px",
                  border: "none",
                  padding: "0.5rem 0",
                }}
                aria-labelledby={`dropdownMenuButton-${i}`}
              >
                {item.submenu.map((sub, j) => (
                  <li key={j}>
                    <Link className="dropdown-item" href={sub.href}>
                      {sub.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="menu-item-wrapper" key={i}>
            <Link href={item.href || "#"} className="fw-bold text-gray-979797 no-decoration">
              {item.label}
            </Link>
          </div>
        )
      )}
    </div>
  );
};

export default HeaderMenu;
