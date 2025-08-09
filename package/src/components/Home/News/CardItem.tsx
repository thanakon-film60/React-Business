"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface CardItemProps {
  image: string;
  date: string;
  title: string;
  active?: boolean;
  hovered?: boolean;
  direction?: "left" | "right";
}

const CardItem: React.FC<CardItemProps> = ({
  image,
  date,
  title,
  active,
  hovered,
  direction = "right",
}) => {
  return (
    <motion.div
      layout // ให้ reposition ลื่น
      initial={{ opacity: 0, x: direction === "right" ? 24 : -24, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: active ? 1.02 : 1 }}
      transition={{
        type: "spring",
        stiffness: 280,
        damping: 22,
        mass: 0.8,
      }}
      whileHover={{ y: -6, scale: active ? 1.03 : 1.02 }}
      className={`bg-white rounded-lg p-3 flex flex-col shadow group transition
        ${
          active
            ? "border-4 border-red-500"
            : hovered
            ? "border-4 border-red-300"
            : "border border-gray-200"
        }`}
      style={{
        minHeight: 420,
        maxWidth: 360,
        width: "100%",
        boxShadow: active
          ? "0 0 0 3px #e03e3e55"
          : hovered
          ? "0 0 0 2px #e03e3e22"
          : undefined,
      }}>
      {/* Image */}
      <motion.div
        className="w-full mb-2 rounded-lg overflow-hidden bg-blue-100"
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}>
        <Image
          src={image}
          alt={title}
          width={400}
          height={300}
          className="object-contain w-full h-auto"
        />
      </motion.div>

      {/* Date & Title */}
      <span className="text-xs text-gray-500 mb-1">{date}</span>
      <span className="font-bold text-base mb-3 line-clamp-3">{title}</span>

      {/* Arrow Button */}
      <div className="flex-grow" />
      <motion.button
        className="self-end mt-2 bg-yellow-400 hover:bg-yellow-500 rounded-full px-3 py-1 text-sm"
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}>
        <i className="bi bi-arrow-right text-xl" />
      </motion.button>
    </motion.div>
  );
};

export default CardItem;
