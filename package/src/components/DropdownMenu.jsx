import React, { useState, useEffect } from "react";


export function DropdownMenuItem({ item, open, onOpen, onClose }) {
  return (
    <div
      className="relative menu-item-wrapper with-dropdown"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
    >
      <button
        className={`font-bold px-4 py-2 rounded-xl transition
        ${open ? "bg-gray-200 border-2 border-blue-300 text-gray-900" : "text-gray-400"}`}
        onClick={(e) => {
          e.preventDefault(); 
          open ? onClose() : onOpen();
        }}
        aria-expanded={open}
        type="button"
      >
        {item.label}
      </button>
    
      <div
        className={`dropdown-menu absolute left-1/2 -translate-x-1/2 mt-2 z-20 min-w-[260px] rounded-2xl shadow-xl bg-white
        ${open ? "block" : "hidden"}`}
        style={{ padding: "18px 24px" }}
      >
        <ul>
          {item.submenu.map((sub, idx) => (
            <li key={idx}>
              <a
                href={sub.href}
                className="block px-2 py-1 text-gray-700 hover:text-green-700 font-medium transition"
              >
                {sub.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
