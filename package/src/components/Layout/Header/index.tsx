"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { headerData } from "../Header/Navigation/menuData";
import Logo from "./Logo";
import Image from "next/image";
import HeaderLink from "../Header/Navigation/HeaderLink";
import LanguageSwitcher from "@/components/Header/LanguageSwitcher";


const Header: React.FC = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ปิด mobile menu เมื่อคลิกข้างนอก
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        navbarOpen
      ) {
        setNavbarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navbarOpen]);

  useEffect(() => {
    // @ts-ignore
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  const menu1 = headerData.slice(0, 4);
  const menu2 = headerData.slice(4);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300 border-b border-black/60 bg-white">
      <div className="container" style={{ maxWidth:1520 }}>
        <div className="d-flex align-items-center w-100 px-md-3 px-lg-4" style={{ height: 120 }}>
          {/* --- เมนูซ้าย --- */}
          <div className="d-flex menu-desktop flex-grow-1 align-items-center gap-1 gap-md-2  justify-content-end">
            {menu1.map((item, i) =>
              item.submenu ? (
                <div className="menu-item-wrapper with-dropdown" key={i}>
                  <div className="dropdown w-100 h-100">
                    <button
                      className="btn btn-link dropdown-toggle text-gray-979797 w-100 h-100 fw-bold"
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
                  <HeaderLink item={item} />
                </div>
              )
            )}
          </div>

          {/* --- LOGO --- */}
          <div className="d-flex align-items-center justify-content-center flex-shrink-0">
            <Logo />
          </div>

          {/* --- เมนูขวา + ภาษา --- */}
          <div className="d-flex menu-desktop flex-grow-1 align-items-center gap-1 justify-content-start">
            {menu2.map((item, i) =>
              item.submenu ? (
                <div className="menu-item-wrapper with-dropdown" key={menu1.length + i}>
                  <div className="dropdown w-100 h-100">
                    <button
                      className="btn btn-link dropdown-toggle text-gray-979797 w-100 h-100 fw-bold"
                      type="button"
                      id={`dropdownMenuButton-${menu1.length + i}`}
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
                      className="dropdown-menu"
                      aria-labelledby={`dropdownMenuButton-${menu1.length + i}`}
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
                <div className="menu-item-wrapper" key={menu1.length + i}>
                  <HeaderLink item={item} />
                </div>
              )
            )}
          </div>
            <div className="d-flex align-items-center gap-1 gap-md-2 ms-auto header-lang">
              <Link href="/en" className="d-flex align-items-center gap-1 gap-md-2 text-decoration-none lang-link language-switcher-btn">
                <Image src="/images/icons/us.svg" alt="US Flag" width={20} height={14} className="lang-flag" />
                <span className="lang-text">English</span>
              </Link>
              <Link href="/th" className="d-flex align-items-center gap-1 gap-md-2 text-decoration-none lang-link language-switcher-btn">
                <Image src="/images/icons/th.svg" alt="TH Flag" width={20} height={14} className="lang-flag" />
                <span className="lang-text">Thai</span>
              </Link>
            </div>
 
            {/* Hamburger ปุ่ม burger */}
          <div className="burger-mobile align-items-center ms-auto" style={{ minHeight: 48 }}>
            <button
              onClick={() => setNavbarOpen((v) => !v)}
              className="btn border-0 p-2"
              aria-label="Open menu"
              type="button"
              style={{ background: "none" }}
            >
              <i className="bi bi-list" style={{ fontSize: 40 }}></i>
            </button>
          </div>


        {/* Mobile menu side panel */}
          <div
            ref={mobileMenuRef}
            className={`d-xxl-none fixed top-0 end-0 h-100 w-100 bg-darkmode shadow-lg transition-transform duration-300 ${
              navbarOpen ? "" : "d-none"
            }`}
            style={{ maxWidth: 360, zIndex: 9999 }}
          >
          <div className="d-flex align-items-center justify-content-between p-4">
            <h2 className="fs-4 fw-bold text-midnight_text">
            </h2>
            <button
              onClick={() => setNavbarOpen(false)}
              className="bg-white border-0 p-0 ms-3 d-flex align-items-center justify-content-center"
              style={{ width: 32, height: 32 }}
              aria-label="Close menu Modal"
            >
              <i className="bi bi-x-lg" style={{ fontSize: 28 }}></i>
            </button>
          </div>
          {/* ...mobile menu content... */}
        </div>

        </div>
        {/* --- Mobile Menu --- */}

      </div>
    </header>
  );
};

export default Header;
