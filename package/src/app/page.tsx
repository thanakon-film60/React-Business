import React from "react";
import Hero from "@/components/Home/Video";
import Aboutus from "@/components/Home/AboutUs";
import Dedicated from "@/components/Home/Detail";
import Insta from "@/components/Home/Insta";
import { Metadata } from "next";
import ProductsServices from "@/components/ProductsServices";

// สำหรับ CSS
import '../Style/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../app/globals.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export const metadata: Metadata = {
  title: "THAI PACKAGING & PRINTING PCL",
  icons: {
    icon: '/TPP.ico',
  },
};

export default function Home() {
  return (
    <main>
      <Hero />
      <Aboutus />
      {/* <ProductsServices/> */}
      <Dedicated />
      <Insta />
    </main>
  );
}

// *ALL
