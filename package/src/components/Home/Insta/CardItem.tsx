import React from "react";
import Image from "next/image";

interface CardItemProps {
  image: string;
  date: string;
  title: string;
}

const CardItem: React.FC<CardItemProps> = ({ image, date, title }) => {
  return (
    <div className="bg-white rounded-lg p-3 flex flex-col shadow group hover:shadow-lg transition">
      {/* Image */}
        <div className="w-full mb-2 rounded-lg overflow-hidden bg-blue-100">
          <Image
            src={image}
            alt={title}
            width={400} 
            height={300} 
            className="object-contain w-full h-auto"
          />
        </div>
      {/* Date & Title */}
      <span className="text-xs text-gray-500 mb-1">{date}</span>
      <span className="font-bold text-base mb-3 line-clamp-3">{title}</span>

      {/* Arrow Button */}
      <div className="flex-grow" />
      <button className="self-end mt-2 bg-yellow-400 hover:bg-yellow-500 rounded-full px-3 py-1 text-sm transition">
        <i className="bi bi-arrow-right text-xl" />
      </button>
    </div>
  );
};

export default CardItem;
