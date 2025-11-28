"use client";
import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

// Social Media Links - แก้ไข URL ตามต้องการ
const SOCIAL_LINKS = {
  line: "https://line.me/ti/p/YOUR_LINE_ID", // เปลี่ยนเป็น LINE ID ของคุณ
  shopee: "https://shopee.co.th/YOUR_SHOP", // เปลี่ยนเป็น Shopee Shop ของคุณ
  tiktok: "https://www.tiktok.com/@YOUR_TIKTOK", // เปลี่ยนเป็น TikTok ของคุณ
};

// Social Button Component with spectacular effects
interface SocialButtonProps {
  type: "line" | "shopee" | "tiktok";
  href: string;
  index: number;
  isVisible: boolean;
  totalItems: number;
}

const SocialButton: React.FC<SocialButtonProps> = ({
  type,
  href,
  index,
  isVisible,
  totalItems,
}) => {
  const configs = {
    line: {
      bg: "from-[#00B900] to-[#00d900]",
      glow: "#00B900",
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white drop-shadow-md">
          <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
        </svg>
      ),
      label: "LINE",
    },
    shopee: {
      bg: "from-[#EE4D2D] to-[#ff6b4a]",
      glow: "#EE4D2D",
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white drop-shadow-md">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm.248 4.2c2.15 0 3.89 1.793 3.89 4.006 0 .196-.016.39-.047.58h1.61c.127 0 .23.108.23.24v10.2c0 .132-.103.24-.23.24H6.3c-.127 0-.23-.108-.23-.24V9.026c0-.132.103-.24.23-.24h1.61c-.031-.19-.047-.384-.047-.58 0-2.213 1.74-4.006 3.89-4.006h.495zm-.248 1.44c-1.37 0-2.483 1.148-2.483 2.566 0 .198.022.39.064.576h4.838c.042-.186.064-.378.064-.576 0-1.418-1.112-2.566-2.483-2.566z" />
        </svg>
      ),
      label: "Shopee",
    },
    tiktok: {
      bg: "from-[#000000] to-[#333333]",
      glow: "#ff0050",
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white drop-shadow-md">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      ),
      label: "TikTok",
    },
  };

  const config = configs[type];

  // คำนวณตำแหน่งบนวงกลม (เรียงไปทางขวาและบนของปุ่มหลัก)
  const radius = 80; // ระยะห่างจากปุ่มหลัก
  const startAngle = -90; // เริ่มจากด้านบน
  const angleStep = 45; // ระยะห่างระหว่างแต่ละปุ่ม
  const angle = startAngle + index * angleStep; // ไปทางขวา
  const radian = (angle * Math.PI) / 180;

  const x = Math.cos(radian) * radius;
  const y = Math.sin(radian) * radius;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        absolute w-14 h-14 rounded-full shadow-2xl flex items-center justify-center
        bg-gradient-to-br ${config.bg}
        transform transition-all duration-500 ease-out
        hover:scale-125 active:scale-95
        ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"}
      `}
      style={{
        transform: isVisible
          ? `translate(${x}px, ${y}px) scale(1)`
          : `translate(0px, 0px) scale(0)`,
        transitionDelay: isVisible ? `${index * 80}ms` : "0ms",
        boxShadow: isVisible
          ? `0 0 20px ${config.glow}80, 0 0 40px ${config.glow}40, 0 8px 32px rgba(0,0,0,0.3)`
          : "none",
        zIndex: 10 - index,
      }}
      title={config.label}
    >
      {/* Ripple effect ring */}
      <span
        className={`absolute inset-0 rounded-full animate-ping opacity-30 bg-white`}
        style={{
          animationDuration: "2s",
          display: isVisible ? "block" : "none",
        }}
      />
      {/* Inner glow */}
      <span className="absolute inset-1 rounded-full bg-white/20 blur-sm" />
      {config.icon}
    </a>
  );
};

type MenuItem =
  | { type: "link"; label: string; href: string; right?: string }
  | { type: "action"; label: string; onClick: () => void; right?: string }
  | { type: "submenu"; label: string; items: MenuItem[] };

interface DevMiniToolbarProps {
  position?: "bottom-left" | "bottom-right";
  storageKey?: string;
  items?: MenuItem[];
  // Social links - สามารถ override ได้
  lineUrl?: string;
  shopeeUrl?: string;
  tiktokUrl?: string;
}

const DevMiniToolbar: React.FC<DevMiniToolbarProps> = ({
  position = "bottom-right",
  storageKey = "dev_toolbar_visible",
  items,
  lineUrl = SOCIAL_LINKS.line,
  shopeeUrl = SOCIAL_LINKS.shopee,
  tiktokUrl = SOCIAL_LINKS.tiktok,
}) => {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [submenuIndex, setSubmenuIndex] = useState<number | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const path = usePathname();
  // ปิดเมนูเมื่อเปลี่ยน route
  useEffect(() => {
    setOpen(false);
    setSubmenuIndex(null);
  }, [path]);
  // โหลดสถานะแสดง/ซ่อนจาก localStorage
  useEffect(() => {
    const v = localStorage.getItem(storageKey);
    if (v === "hidden") setHidden(true);
  }, [storageKey]);
  // กดข้างนอกเพื่อปิด
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!open) return;
      const t = e.target as Node;
      if (menuRef.current?.contains(t)) return;
      if (btnRef.current?.contains(t)) return;
      setOpen(false);
      setSubmenuIndex(null);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);
  // คีย์ลัด toggle (Ctrl+;)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.ctrlKey && e.key === ";") {
        e.preventDefault();
        setHidden((h) => {
          const next = !h;
          localStorage.setItem(storageKey, next ? "hidden" : "visible");
          return next;
        });
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [storageKey]);

  if (hidden) return null;

  const containerPos =
    position === "bottom-left" ? "left-4 bottom-4" : "right-4 bottom-4";

  const socialButtons = [
    { type: "line" as const, href: lineUrl },
    { type: "shopee" as const, href: shopeeUrl },
    { type: "tiktok" as const, href: tiktokUrl },
  ];

  return (
    <div className={`fixed ${containerPos} z-[9999] select-none`}>
      {/* Animated background glow - TPP Red */}
      <div
        className={`
          absolute inset-0 w-16 h-16 rounded-full 
          bg-gradient-to-r from-red-600 via-red-500 to-red-400
          blur-xl transition-all duration-500
          ${open ? "opacity-70 scale-150" : "opacity-0 scale-100"}
        `}
        style={{ left: "-4px", bottom: "-4px" }}
      />

      {/* Social Media Buttons - วงกลมรอบปุ่มหลัก */}
      <div className="relative w-16 h-16">
        {socialButtons.map((btn, index) => (
          <SocialButton
            key={btn.type}
            type={btn.type}
            href={btn.href}
            index={index}
            isVisible={open}
            totalItems={socialButtons.length}
          />
        ))}

        {/* ปุ่มลอยหลัก - TPP Style (แดง-ขาว) */}
        <button
          ref={btnRef}
          onClick={() => setOpen((v) => !v)}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          aria-haspopup="menu"
          aria-expanded={open}
          className={`
            relative w-16 h-16 rounded-full shadow-2xl
            flex items-center justify-center font-bold
            transition-all duration-500 ease-out
            focus:outline-none
            overflow-hidden
            ${open ? "rotate-45 scale-110" : "rotate-0 scale-100"}
          `}
          style={{
            background: open
              ? "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)"
              : "linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)",
            boxShadow: open
              ? "0 0 30px rgba(220, 38, 38, 0.8), 0 0 60px rgba(185, 28, 28, 0.5), 0 10px 40px rgba(0,0,0,0.3)"
              : isHovering
              ? "0 0 25px rgba(239, 68, 68, 0.7), 0 0 50px rgba(220, 38, 38, 0.4), 0 8px 32px rgba(0,0,0,0.3)"
              : "0 0 15px rgba(220, 38, 38, 0.5), 0 6px 24px rgba(0,0,0,0.25)",
          }}
          title="ติดต่อเรา TPP (Ctrl+; เพื่อซ่อน/แสดง)"
        >
          {/* White outer ring */}
          <span
            className="absolute inset-0 rounded-full"
            style={{
              border: "3px solid white",
              boxShadow: "inset 0 0 10px rgba(255,255,255,0.3)",
            }}
          />

          {/* Inner red circle with white accent */}
          <span
            className="absolute inset-[6px] rounded-full"
            style={{
              background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
              border: "2px solid rgba(255,255,255,0.4)",
            }}
          />

          {/* Animated glow ring */}
          <span
            className={`
              absolute inset-0 rounded-full
              ${open ? "" : "animate-pulse"}
            `}
            style={{
              border: "2px solid rgba(255,255,255,0.5)",
              animationDuration: "2s",
            }}
          />

          {/* Pulse rings */}
          <span
            className={`
              absolute -inset-1 rounded-full border-2 border-red-300/50
              ${open ? "" : "animate-ping"}
            `}
            style={{ animationDuration: "2s" }}
          />
          <span
            className={`
              absolute -inset-3 rounded-full border border-red-200/30
              ${open ? "" : "animate-ping"}
            `}
            style={{ animationDuration: "2.5s", animationDelay: "0.5s" }}
          />

          {/* TPP Text or Icon */}
          <span
            className={`
              relative z-10 text-white font-extrabold text-sm
              transition-all duration-500 drop-shadow-lg
              ${open ? "opacity-0 scale-0" : "opacity-100 scale-100"}
            `}
            style={{
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              letterSpacing: "0.5px",
            }}
          >
            TPP
          </span>

          {/* X Icon when open */}
          <svg
            className={`
              absolute z-10 w-6 h-6 text-white transition-all duration-500
              drop-shadow-lg
              ${open ? "opacity-100 scale-100" : "opacity-0 scale-0"}
            `}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>

          {/* Sparkle effects - white */}
          <span
            className={`
              absolute w-2 h-2 bg-white rounded-full
              transition-all duration-300
              ${isHovering || open ? "opacity-100" : "opacity-0"}
            `}
            style={{
              top: "6px",
              right: "10px",
              animation: "sparkle 1.5s ease-in-out infinite",
            }}
          />
          <span
            className={`
              absolute w-1.5 h-1.5 bg-white rounded-full
              transition-all duration-300
              ${isHovering || open ? "opacity-100" : "opacity-0"}
            `}
            style={{
              bottom: "8px",
              left: "8px",
              animation: "sparkle 1.5s ease-in-out infinite 0.5s",
            }}
          />
          <span
            className={`
              absolute w-1 h-1 bg-white rounded-full
              transition-all duration-300
              ${isHovering ? "opacity-100" : "opacity-0"}
            `}
            style={{
              top: "12px",
              left: "6px",
              animation: "sparkle 1.5s ease-in-out infinite 1s",
            }}
          />
        </button>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes sparkle {
          0%,
          100% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default DevMiniToolbar;
