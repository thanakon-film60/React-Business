import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex flex-col items-center justify-center px-4 py-16 w-full max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row items-center gap-10 w-full">
        <div className="w-full md:w-1/2 flex justify-center">
          <Image
            src="/images/404.svg"
            alt="404"
            width={320}
            height={340}
            className="object-contain"
            priority
          />
        </div>
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Page Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Oops! The page you are looking for does not exist.<br />
            It might have been moved or deleted.
          </p>
          <Link
            href="/"
            className="inline-block rounded-lg bg-blue-600 px-7 py-3 text-base font-semibold text-white shadow hover:bg-blue-700 transition"
          >
            Go To Home
          </Link>
        </div>
      </div>
    </section>
  );
}

