"use client";

import React, { forwardRef, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

type SubItem = { label: string; href: string };
type MenuItem = { label: string; href?: string; submenu?: SubItem[] };

type DrawerMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  items: MenuItem[];
};

const DrawerMenu = forwardRef<HTMLDivElement, DrawerMenuProps>(
  ({ isOpen, onClose, items }, mobileMenuRef) => {
    const panelRef = useRef<HTMLDivElement>(null);

    // sync ref ภายนอกกับ ref ภายใน
    const setRefs = (el: HTMLDivElement | null) => {
      panelRef.current = el;
      if (typeof mobileMenuRef === "function") {
        mobileMenuRef(el);
      } else if (mobileMenuRef && "current" in (mobileMenuRef as any)) {
        (
          mobileMenuRef as React.MutableRefObject<HTMLDivElement | null>
        ).current = el;
      }
    };

    // เมื่อปิด drawer: ปิด details ทั้งหมด + เลื่อนขึ้น + blur โฟกัส
    useEffect(() => {
      if (isOpen) return;
      const root = panelRef.current;
      if (!root) return;

      root.querySelectorAll("details[open]").forEach((d) => {
        d.removeAttribute("open");
      });

      const navEl = root.querySelector(".drawer-nav") as HTMLElement | null;
      if (navEl) navEl.scrollTo({ top: 0, behavior: "auto" });

      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }, [isOpen]);

    // อะคอร์เดียน: เปิดอันใหม่แล้วหุบอันเก่า (ไม่มีการรีเซ็ตแอนิเมชัน)
    useEffect(() => {
      const root = panelRef.current;
      if (!root) return;

      const detailsEls = Array.from(
        root.querySelectorAll<HTMLDetailsElement>(".drawer-details")
      );

      const onToggle = (ev: Event) => {
        const current = ev.currentTarget as HTMLDetailsElement;
        if (current.open) {
          detailsEls.forEach((d) => {
            if (d !== current && d.open) d.removeAttribute("open");
          });
        }
      };

      detailsEls.forEach((d) => d.addEventListener("toggle", onToggle));
      return () =>
        detailsEls.forEach((d) => d.removeEventListener("toggle", onToggle));
    }, [isOpen, items]);

    return (
      <>
        <div
          aria-hidden="true"
          onClick={onClose}
          className={`drawer-backdrop fixed inset-0 z-[9998] bg-black/50 transition-opacity duration-300 ${
            isOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        />

        <div
          ref={setRefs}
          className={`mobile-1600 fixed inset-y-0 right-0 drawer-panel transition-transform duration-300 z-[9999] ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
          role="dialog"
          aria-modal="true">
          {/* โครง 3 แถว: header / nav / footer */}
          <div
            className={`grid grid-rows-[auto_1fr_auto] h-[100dvh] ${
              isOpen ? "drawer-enter" : ""
            }`}>
            {/* Header */}
            <div className="drawer-header">
              <h2 className="drawer-title">Menu</h2>
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="drawer-close">
                <i className="bi bi-x-lg text-2xl"></i>
              </button>
            </div>

            {/* Nav */}
            <nav className="drawer-nav flex flex-col gap-2">
              {items.map((item, i) => (
                <div
                  key={i}
                  className={isOpen ? "drawer-item-anim" : ""}
                  style={
                    isOpen ? { animationDelay: `${i * 60 + 80}ms` } : undefined
                  }>
                  {item.submenu ? (
                    <details className="drawer-details">
                      <summary
                        className={isOpen ? "drawer-item-anim" : ""}
                        style={
                          isOpen
                            ? { animationDelay: `${i * 60 + 80}ms` }
                            : undefined
                        }>
                        {item.label}
                      </summary>

                      <div className="flex flex-col pl-3 mt-1 drawer-sub">
                        {item.submenu.map((sub, j) => (
                          <Link
                            key={j}
                            href={sub.href}
                            onClick={onClose}
                            className={`drawer-item ${
                              isOpen ? "drawer-item-anim" : ""
                            }`}
                            style={
                              isOpen
                                ? {
                                    animationDelay: `${
                                      (i + j + 1) * 50 + 120
                                    }ms`,
                                  }
                                : undefined
                            }>
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </details>
                  ) : item.href ? (
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="drawer-item">
                      {item.label}
                    </Link>
                  ) : (
                    <span className="drawer-item">{item.label}</span>
                  )}
                </div>
              ))}
            </nav>

            {/* Footer: language switch */}
            <div
              className="drawer-lang flex items-center gap-6 drawer-item-anim"
              style={isOpen ? { animationDelay: "120ms" } : undefined}>
              <Link href="/en" onClick={onClose}>
                <Image
                  src="/images/icons/us.svg"
                  width={24}
                  height={16}
                  alt="English"
                />
                <span>English</span>
              </Link>
              <Link href="/th" onClick={onClose}>
                <Image
                  src="/images/icons/th.svg"
                  width={24}
                  height={16}
                  alt="Thai"
                />
                <span>Thai</span>
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }
);

DrawerMenu.displayName = "DrawerMenu";
export default DrawerMenu;
